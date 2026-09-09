"""
Eco-Link SQLite Database Layer
==============================
Handles persistent storage, schemas, migrations, and seed data for:
- Collector profiles
- Recycler facilities
- E-Waste material lots
- Bids & offers
- Handover records & CPCB Form-6 compliance manifests
"""

import sqlite3
import json
import os
import random
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "ecolink.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables and seeds initial data if empty."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Collector Profile Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS collector_profile (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT NOT NULL,
        zone TEXT NOT NULL,
        upi_id TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        kyc_status TEXT NOT NULL,
        badge_title TEXT NOT NULL,
        total_lots_completed INTEGER DEFAULT 0
    )
    """)

    # 2. Recyclers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recyclers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        authorized INTEGER DEFAULT 1,
        location TEXT NOT NULL,
        distance_km REAL,
        proximity_key TEXT,
        materials_accepted TEXT NOT NULL, -- JSON array
        offered_price_per_kg INTEGER NOT NULL,
        pickup_available INTEGER DEFAULT 1,
        match_score INTEGER DEFAULT 95,
        epr_license TEXT,
        contact_person TEXT,
        phone TEXT,
        notes TEXT
    )
    """)

    # 3. Material Lots Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS lots (
        lot_id TEXT PRIMARY KEY,
        material TEXT NOT NULL,
        weight_kg REAL NOT NULL,
        photo_url TEXT,
        location TEXT NOT NULL,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL,
        reference_price_per_kg INTEGER NOT NULL,
        estimated_value INTEGER NOT NULL,
        offered_price_per_kg INTEGER,
        total_offer_value INTEGER,
        matched_recycler_id TEXT,
        handover_ref TEXT,
        payment_status TEXT DEFAULT 'Pending',
        pickup_available INTEGER DEFAULT 1,
        completed_at TEXT,
        is_offline_draft INTEGER DEFAULT 0
    )
    """)

    # 4. Offers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS offers (
        lot_id TEXT PRIMARY KEY,
        recycler_id TEXT NOT NULL,
        offered_price_per_kg INTEGER NOT NULL,
        total_value INTEGER NOT NULL,
        pickup_available INTEGER DEFAULT 1,
        status TEXT NOT NULL,
        notes TEXT,
        created_at TEXT
    )
    """)

    # 5. Handover Records Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS handovers (
        lot_id TEXT PRIMARY KEY,
        material TEXT NOT NULL,
        weight_kg REAL NOT NULL,
        recycler_name TEXT NOT NULL,
        recycler_id TEXT,
        location TEXT NOT NULL,
        date_time TEXT NOT NULL,
        final_value INTEGER NOT NULL,
        payment_status TEXT DEFAULT 'Pending',
        payment_method TEXT DEFAULT 'UPI',
        handover_ref TEXT NOT NULL,
        confirmed INTEGER DEFAULT 0,
        manifest_id TEXT,
        verified_weight_kg REAL,
        vehicle_number TEXT,
        driver_name TEXT,
        upi_id TEXT
    )
    """)

    conn.commit()

    # Check if empty, then seed default records
    cursor.execute("SELECT COUNT(*) FROM collector_profile")
    if cursor.fetchone()[0] == 0:
        seed_default_data(conn)

    conn.close()

def seed_default_data(conn: sqlite3.Connection):
    """Populates database with realistic default data matching the digital bridge."""
    cursor = conn.cursor()

    # Seed Collector Profile
    cursor.execute("""
    INSERT INTO collector_profile (
        id, name, phone, location, zone, upi_id,
        registration_date, kyc_status, badge_title, total_lots_completed
    ) VALUES (
        'KAB-MH-PUN-0842',
        'Sunil Shinde',
        '+91 98765 43210',
        'Shivajinagar, Pune',
        'Pune Central Ward 4',
        'sunil.kabadiwala@okhdfcbank',
        '14 Jan 2024',
        'Verified',
        'Authorized Green Collector',
        18
    )
    """)

    # Seed Recyclers
    recyclers = [
        (
            'REC-002',
            'Bharat Metals & E-Waste Processors',
            1,
            'Hadapsar MIDC, Pune',
            3.2,
            'near',
            json.dumps(['PCB', 'Cable', 'Motor', 'LCD', 'Battery', 'Mixed Plastic']),
            360,
            1,
            97,
            'MPCB-HW-PUN-2025-1104',
            'Anand Shinde (Logistics)',
            '+91 97654 11234',
            'Local ward hub · 15 min collection arrival guarantee'
        ),
        (
            'REC-001',
            'GreenCycle Authorized Recyclers',
            1,
            'Bhosari MIDC Industrial Area, Pune',
            14.5,
            'mid',
            json.dumps(['PCB', 'LCD', 'Mixed Plastic', 'Cable']),
            345,
            1,
            92,
            'CPCB-EPR-MH-2024-0891',
            'Vikram Joshi (Operations)',
            '+91 98230 45671',
            'Central plant · Same-day scheduled truck pickup'
        ),
        (
            'REC-003',
            'EcoVolt High-Capacity Circular Solutions',
            1,
            'Chakan Mega Auto Hub Phase II, Pune Outer',
            32.8,
            'far',
            json.dumps(['PCB', 'Battery', 'Motor', 'Cable', 'LCD', 'Mixed Plastic']),
            330,
            1,
            86,
            'CPCB-BAT-EPR-2024-0320',
            'Sunita Patil (Compliance)',
            '+91 98812 99876',
            'Regional bulk processing center · Next-day route collection'
        )
    ]

    cursor.executemany("""
    INSERT INTO recyclers (
        id, name, authorized, location, distance_km, proximity_key,
        materials_accepted, offered_price_per_kg, pickup_available,
        match_score, epr_license, contact_person, phone, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, recyclers)

    # Seed Initial Lots
    lots = [
        (
            'EW-001',
            'PCB',
            15.0,
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
            'Shivajinagar, Pune',
            '2026-09-08T09:30:00Z',
            'Accepted',
            320,
            4800,
            345,
            5175,
            'REC-001',
            'HOF-PUN-2026-48291',
            'Pending',
            1,
            None,
            0
        ),
        (
            'EW-002',
            'Cable',
            28.5,
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
            'Kothrud, Pune',
            '2026-09-07T14:15:00Z',
            'Completed',
            280,
            7980,
            305,
            8693,
            'REC-002',
            'HOF-PUN-2026-11842',
            'Paid',
            1,
            '2026-09-07T16:30:00Z',
            0
        ),
        (
            'EW-003',
            'Battery',
            8.0,
            'https://images.unsplash.com/photo-1619641253457-3f8d3fa300b9?w=400',
            'Hadapsar, Pune',
            '2026-09-08T11:00:00Z',
            'Created',
            190,
            1520,
            None,
            None,
            'REC-002',
            None,
            'Pending',
            1,
            None,
            0
        )
    ]

    cursor.executemany("""
    INSERT INTO lots (
        lot_id, material, weight_kg, photo_url, location, created_at,
        status, reference_price_per_kg, estimated_value, offered_price_per_kg,
        total_offer_value, matched_recycler_id, handover_ref, payment_status,
        pickup_available, completed_at, is_offline_draft
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, lots)

    # Seed Initial Offers
    offers = [
        (
            'EW-001',
            'REC-001',
            345,
            5175,
            1,
            'accepted',
            'Authorized recycling by GreenCycle. Form-6 compliance certificate guaranteed.',
            '2026-09-08T10:00:00Z'
        ),
        (
            'EW-002',
            'REC-002',
            305,
            8693,
            1,
            'accepted',
            'Doorstep collection with digital scale verification at Kothrud ward.',
            '2026-09-07T14:30:00Z'
        )
    ]

    cursor.executemany("""
    INSERT INTO offers (
        lot_id, recycler_id, offered_price_per_kg, total_value,
        pickup_available, status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, offers)

    # Seed Initial Handovers
    handovers = [
        (
            'EW-001',
            'PCB',
            15.0,
            'GreenCycle Authorized Recyclers',
            'REC-001',
            'Shivajinagar, Pune',
            '2026-09-08T10:45:00Z',
            5175,
            'Pending',
            'UPI',
            'HOF-PUN-2026-48291',
            0,
            'EPR-FORM6-2026-482',
            15.0,
            'MH-12-QX-4891',
            'Ramesh Shinde (Authorized Driver)',
            'sunil.kabadiwala@okhdfcbank'
        ),
        (
            'EW-002',
            'Cable',
            28.5,
            'Bharat Metals & E-Waste Processors',
            'REC-002',
            'Kothrud, Pune',
            '2026-09-07T16:30:00Z',
            8693,
            'Paid',
            'UPI',
            'HOF-PUN-2026-11842',
            1,
            'EPR-FORM6-2026-118',
            28.5,
            'MH-12-TR-9021',
            'Suresh Jadhav (Driver)',
            'sunil.kabadiwala@okhdfcbank'
        )
    ]

    cursor.executemany("""
    INSERT INTO handovers (
        lot_id, material, weight_kg, recycler_name, recycler_id, location,
        date_time, final_value, payment_status, payment_method, handover_ref,
        confirmed, manifest_id, verified_weight_kg, vehicle_number, driver_name, upi_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, handovers)

    conn.commit()

def reset_db():
    """Drops and re-creates tables with clean default data."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS collector_profile")
    cursor.execute("DROP TABLE IF EXISTS recyclers")
    cursor.execute("DROP TABLE IF EXISTS lots")
    cursor.execute("DROP TABLE IF EXISTS offers")
    cursor.execute("DROP TABLE IF EXISTS handovers")
    conn.commit()
    conn.close()
    init_db()

# -----------------------------------------------------------------------------
# DAO Helpers for Queries and Updates
# -----------------------------------------------------------------------------

def get_collector_profile(collector_id: Optional[str] = None) -> Dict[str, Any]:
    conn = get_connection()
    if collector_id:
        row = conn.execute("SELECT * FROM collector_profile WHERE id = ?", (collector_id,)).fetchone()
    else:
        row = conn.execute("SELECT * FROM collector_profile ORDER BY rowid DESC LIMIT 1").fetchone()
    conn.close()
    if not row:
        return {}
    return {
        "id": row["id"],
        "name": row["name"],
        "phone": row["phone"],
        "location": row["location"],
        "zone": row["zone"],
        "upiId": row["upi_id"],
        "registrationDate": row["registration_date"],
        "kycStatus": row["kyc_status"],
        "badgeTitle": row["badge_title"],
        "totalLotsCompleted": row["total_lots_completed"]
    }

def create_collector_profile(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    c_id = data.get("id") or f"KAB-PUN-{random.randint(1000, 9999)}"
    name = data.get("name") or "New Scrap Collector"
    phone = data.get("phone") or "+91 98000 00000"
    location = data.get("location") or "Pune City"
    zone = data.get("zone") or "Zone-1"
    upi_id = data.get("upiId") or f"{name.lower().replace(' ', '')}@okaxis"
    reg_date = data.get("registrationDate") or datetime.utcnow().strftime("%Y-%m-%d")
    kyc_status = data.get("kycStatus") or "Verified"
    badge_title = data.get("badgeTitle") or "Kabadiwala Connect Green Collector"
    total_completed = data.get("totalLotsCompleted", 0)

    # Clean previous profile and lots if requested for a brand new user
    if data.get("resetLotsForNewUser"):
        cursor.execute("DELETE FROM collector_profile")
        cursor.execute("DELETE FROM lots")
        cursor.execute("DELETE FROM offers")
        cursor.execute("DELETE FROM handovers")

    cursor.execute("""
    INSERT INTO collector_profile (
        id, name, phone, location, zone, upi_id, registration_date, kyc_status, badge_title, total_lots_completed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        name=excluded.name, phone=excluded.phone, location=excluded.location, zone=excluded.zone,
        upi_id=excluded.upi_id, total_lots_completed=excluded.total_lots_completed
    """, (c_id, name, phone, location, zone, upi_id, reg_date, kyc_status, badge_title, total_completed))
    conn.commit()
    conn.close()
    return get_collector_profile(c_id)

def update_collector_profile(updates: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    current = get_collector_profile()
    if not current:
        conn.close()
        return create_collector_profile(updates)

    name = updates.get("name", current["name"])
    phone = updates.get("phone", current["phone"])
    location = updates.get("location", current["location"])
    zone = updates.get("zone", current["zone"])
    upi_id = updates.get("upiId", updates.get("upi_id", current["upiId"]))
    total_completed = updates.get("totalLotsCompleted", current["totalLotsCompleted"])

    cursor.execute("""
    UPDATE collector_profile SET
        name = ?, phone = ?, location = ?, zone = ?, upi_id = ?, total_lots_completed = ?
    WHERE id = ?
    """, (name, phone, location, zone, upi_id, total_completed, current["id"]))
    conn.commit()
    conn.close()
    return get_collector_profile()

def create_recycler(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    r_id = data.get("id") or f"REC-NEW-{random.randint(100, 999)}"
    name = data.get("name") or "Authorized Recycling Facility"
    authorized = 1 if data.get("authorized", True) else 0
    location = data.get("location") or "Pune Industrial MIDC"
    distance_km = float(data.get("distanceKm", 12.5))
    proximity_key = data.get("proximityKey", "near")
    materials = json.dumps(data.get("materialsAccepted", ["PCB", "Cable", "Battery", "LCD", "Motor", "Mixed Plastic", "Metal", "Chargers / Adapters", "Other E-Waste"]))
    rate = int(data.get("offeredPricePerKg", 330))
    pickup_avail = 1 if data.get("pickupAvailable", True) else 0
    match_score = int(data.get("matchScore", 95))
    epr = data.get("eprLicense") or f"CPCB-EPR-MH-{datetime.utcnow().year}-{random.randint(1000, 9999)}"
    contact = data.get("contactPerson") or "Compliance Officer"
    phone = data.get("phone") or "+91 98220 99999"
    notes = data.get("notes") or "State-of-the-art CPCB Authorized E-Waste Processing Plant"

    cursor.execute("""
    INSERT INTO recyclers (
        id, name, authorized, location, distance_km, proximity_key, materials_accepted,
        offered_price_per_kg, pickup_available, match_score, epr_license, contact_person, phone, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        name=excluded.name, location=excluded.location, materials_accepted=excluded.materials_accepted,
        offered_price_per_kg=excluded.offered_price_per_kg, epr_license=excluded.epr_license,
        contact_person=excluded.contact_person, phone=excluded.phone, notes=excluded.notes
    """, (r_id, name, authorized, location, distance_km, proximity_key, materials, rate, pickup_avail, match_score, epr, contact, phone, notes))
    conn.commit()
    conn.close()
    return get_recycler(r_id)

def get_all_recyclers() -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM recyclers").fetchall()
    conn.close()
    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "name": r["name"],
            "authorized": bool(r["authorized"]),
            "location": r["location"],
            "distanceKm": r["distance_km"],
            "proximityKey": r["proximity_key"],
            "materialsAccepted": json.loads(r["materials_accepted"]),
            "offeredPricePerKg": r["offered_price_per_kg"],
            "pickupAvailable": bool(r["pickup_available"]),
            "matchScore": r["match_score"],
            "eprLicense": r["epr_license"],
            "contactPerson": r["contact_person"],
            "phone": r["phone"],
            "notes": r["notes"]
        })
    return result

def get_recycler(recycler_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    r = conn.execute("SELECT * FROM recyclers WHERE id = ?", (recycler_id,)).fetchone()
    conn.close()
    if not r:
        return None
    return {
        "id": r["id"],
        "name": r["name"],
        "authorized": bool(r["authorized"]),
        "location": r["location"],
        "distanceKm": r["distance_km"],
        "proximityKey": r["proximity_key"],
        "materialsAccepted": json.loads(r["materials_accepted"]),
        "offeredPricePerKg": r["offered_price_per_kg"],
        "pickupAvailable": bool(r["pickup_available"]),
        "matchScore": r["match_score"],
        "eprLicense": r["epr_license"],
        "contactPerson": r["contact_person"],
        "phone": r["phone"],
        "notes": r["notes"]
    }

def update_recycler(recycler_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    current = get_recycler(recycler_id)
    if not current:
        conn.close()
        return None

    name = updates.get("name", current["name"])
    location = updates.get("location", current["location"])
    materials = json.dumps(updates.get("materialsAccepted", current["materialsAccepted"]))
    rate = updates.get("offeredPricePerKg", current["offeredPricePerKg"])
    epr = updates.get("eprLicense", current["eprLicense"])
    contact = updates.get("contactPerson", current["contactPerson"])
    phone = updates.get("phone", current["phone"])
    notes = updates.get("notes", current["notes"])

    cursor.execute("""
    UPDATE recyclers SET
        name = ?, location = ?, materials_accepted = ?, offered_price_per_kg = ?,
        epr_license = ?, contact_person = ?, phone = ?, notes = ?
    WHERE id = ?
    """, (name, location, materials, rate, epr, contact, phone, notes, recycler_id))
    conn.commit()
    conn.close()
    return get_recycler(recycler_id)

def get_all_lots(status: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    if status:
        rows = conn.execute("SELECT * FROM lots WHERE status = ? ORDER BY created_at DESC", (status,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM lots ORDER BY created_at DESC").fetchall()
    conn.close()

    result = []
    for l in rows:
        result.append({
            "lotId": l["lot_id"],
            "material": l["material"],
            "weightKg": l["weight_kg"],
            "photoUrl": l["photo_url"],
            "location": l["location"],
            "createdAt": l["created_at"],
            "status": l["status"],
            "referencePricePerKg": l["reference_price_per_kg"],
            "estimatedValue": l["estimated_value"],
            "offeredPricePerKg": l["offered_price_per_kg"],
            "totalOfferValue": l["total_offer_value"],
            "matchedRecyclerId": l["matched_recycler_id"],
            "handoverRef": l["handover_ref"],
            "paymentStatus": l["payment_status"],
            "pickupAvailable": bool(l["pickup_available"]),
            "completedAt": l["completed_at"],
            "isOfflineDraft": bool(l["is_offline_draft"])
        })
    return result

def get_lot(lot_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    l = conn.execute("SELECT * FROM lots WHERE lot_id = ?", (lot_id,)).fetchone()
    conn.close()
    if not l:
        return None
    return {
        "lotId": l["lot_id"],
        "material": l["material"],
        "weightKg": l["weight_kg"],
        "photoUrl": l["photo_url"],
        "location": l["location"],
        "createdAt": l["created_at"],
        "status": l["status"],
        "referencePricePerKg": l["reference_price_per_kg"],
        "estimatedValue": l["estimated_value"],
        "offeredPricePerKg": l["offered_price_per_kg"],
        "totalOfferValue": l["total_offer_value"],
        "matchedRecyclerId": l["matched_recycler_id"],
        "handoverRef": l["handover_ref"],
        "paymentStatus": l["payment_status"],
        "pickupAvailable": bool(l["pickup_available"]),
        "completedAt": l["completed_at"],
        "isOfflineDraft": bool(l["is_offline_draft"])
    }

def create_or_update_lot(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()

    lot_id = data.get("lotId", data.get("lot_id"))
    if not lot_id:
        # Generate next lot id
        cursor.execute("SELECT COUNT(*) FROM lots")
        cnt = cursor.fetchone()[0] + 1
        lot_id = f"EW-{cnt:03d}"

    cursor.execute("""
    INSERT INTO lots (
        lot_id, material, weight_kg, photo_url, location, created_at,
        status, reference_price_per_kg, estimated_value, offered_price_per_kg,
        total_offer_value, matched_recycler_id, handover_ref, payment_status,
        pickup_available, completed_at, is_offline_draft
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(lot_id) DO UPDATE SET
        material=excluded.material,
        weight_kg=excluded.weight_kg,
        photo_url=excluded.photo_url,
        location=excluded.location,
        status=excluded.status,
        reference_price_per_kg=excluded.reference_price_per_kg,
        estimated_value=excluded.estimated_value,
        offered_price_per_kg=excluded.offered_price_per_kg,
        total_offer_value=excluded.total_offer_value,
        matched_recycler_id=excluded.matched_recycler_id,
        handover_ref=excluded.handover_ref,
        payment_status=excluded.payment_status,
        pickup_available=excluded.pickup_available,
        completed_at=excluded.completed_at,
        is_offline_draft=excluded.is_offline_draft
    """, (
        lot_id,
        data.get("material", "PCB"),
        data.get("weightKg", data.get("weight_kg", 5.0)),
        data.get("photoUrl", data.get("photo_url", "")),
        data.get("location", "Pune"),
        data.get("createdAt") or data.get("created_at") or datetime.utcnow().isoformat(),
        data.get("status", "Created"),
        data.get("referencePricePerKg", data.get("reference_price_per_kg", 320)),
        data.get("estimatedValue", data.get("estimated_value", 1600)),
        data.get("offeredPricePerKg", data.get("offered_price_per_kg")),
        data.get("totalOfferValue", data.get("total_offer_value")),
        data.get("matchedRecyclerId", data.get("matched_recycler_id")),
        data.get("handoverRef", data.get("handover_ref")),
        data.get("paymentStatus", data.get("payment_status", "Pending")),
        1 if data.get("pickupAvailable", data.get("pickup_available", True)) else 0,
        data.get("completedAt", data.get("completed_at")),
        1 if data.get("isOfflineDraft", data.get("is_offline_draft", False)) else 0
    ))
    conn.commit()
    conn.close()
    return get_lot(lot_id)

def get_all_offers() -> Dict[str, Any]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM offers").fetchall()
    recyclers_map = {r["id"]: r for r in get_all_recyclers()}
    conn.close()

    result = {}
    for o in rows:
        lot_id = o["lot_id"]
        rec_id = o["recycler_id"]
        rec_obj = recyclers_map.get(rec_id, {
            "id": rec_id,
            "name": "Authorized Recycler",
            "authorized": True,
            "location": "Pune",
            "materialsAccepted": ["PCB", "Cable"],
            "offeredPricePerKg": o["offered_price_per_kg"],
            "pickupAvailable": bool(o["pickup_available"]),
            "matchScore": 95
        })

        result[lot_id] = {
            "lotId": lot_id,
            "recycler": rec_obj,
            "offeredPricePerKg": o["offered_price_per_kg"],
            "totalValue": o["total_value"],
            "pickupAvailable": bool(o["pickup_available"]),
            "status": o["status"],
            "notes": o["notes"],
            "createdAt": o["created_at"]
        }
    return result

def get_offer(lot_id: str) -> Optional[Dict[str, Any]]:
    offers = get_all_offers()
    return offers.get(lot_id)

def create_or_update_offer(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()

    lot_id = data.get("lotId", data.get("lot_id"))
    recycler_id = data.get("recyclerId", data.get("recycler_id", "REC-002"))
    price_per_kg = data.get("offeredPricePerKg", data.get("offered_price_per_kg", 350))
    total_val = data.get("totalValue", data.get("total_value", 3500))
    pickup = 1 if data.get("pickupAvailable", data.get("pickup_available", True)) else 0
    status = data.get("status", "pending")
    notes = data.get("notes", "")
    created_at = data.get("createdAt", data.get("created_at", ""))

    cursor.execute("""
    INSERT INTO offers (
        lot_id, recycler_id, offered_price_per_kg, total_value,
        pickup_available, status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(lot_id) DO UPDATE SET
        recycler_id=excluded.recycler_id,
        offered_price_per_kg=excluded.offered_price_per_kg,
        total_value=excluded.total_value,
        pickup_available=excluded.pickup_available,
        status=excluded.status,
        notes=excluded.notes
    """, (lot_id, recycler_id, price_per_kg, total_val, pickup, status, notes, created_at))

    # Also update lot status to 'Offered' if currently 'Created' or 'Matched'
    cursor.execute("""
    UPDATE lots SET
        status = 'Offered',
        offered_price_per_kg = ?,
        total_offer_value = ?,
        matched_recycler_id = ?,
        pickup_available = ?
    WHERE lot_id = ? AND status IN ('Created', 'Priced', 'Matched', 'Offered')
    """, (price_per_kg, total_val, recycler_id, pickup, lot_id))

    conn.commit()
    conn.close()
    return get_offer(lot_id)

def get_all_handovers() -> Dict[str, Any]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM handovers").fetchall()
    conn.close()
    result = {}
    for h in rows:
        lot_id = h["lot_id"]
        result[lot_id] = {
            "lotId": lot_id,
            "material": h["material"],
            "weightKg": h["weight_kg"],
            "recyclerName": h["recycler_name"],
            "recyclerId": h["recycler_id"],
            "location": h["location"],
            "dateTime": h["date_time"],
            "finalValue": h["final_value"],
            "paymentStatus": h["payment_status"],
            "paymentMethod": h["payment_method"],
            "handoverRef": h["handover_ref"],
            "confirmed": bool(h["confirmed"]),
            "manifestId": h["manifest_id"],
            "verifiedWeightKg": h["verified_weight_kg"],
            "vehicleNumber": h["vehicle_number"],
            "driverName": h["driver_name"],
            "upiId": h["upi_id"]
        }
    return result

def get_handover(lot_id: str) -> Optional[Dict[str, Any]]:
    handovers = get_all_handovers()
    return handovers.get(lot_id)

def create_or_update_handover(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()

    lot_id = data.get("lotId", data.get("lot_id"))
    material = data.get("material", "PCB")
    weight_kg = data.get("weightKg", data.get("weight_kg", 5.0))
    recycler_name = data.get("recyclerName", data.get("recycler_name", "Authorized Recycler"))
    recycler_id = data.get("recyclerId", data.get("recycler_id", "REC-002"))
    location = data.get("location", "Pune")
    date_time = data.get("dateTime", data.get("date_time", ""))
    final_value = data.get("finalValue", data.get("final_value", 1500))
    payment_status = data.get("paymentStatus", data.get("payment_status", "Pending"))
    payment_method = data.get("paymentMethod", data.get("payment_method", "UPI"))
    handover_ref = data.get("handoverRef", data.get("handover_ref", f"HOF-PUN-2026-{lot_id}"))
    confirmed = 1 if data.get("confirmed", False) else 0
    manifest_id = data.get("manifestId", data.get("manifest_id", f"EPR-FORM6-2026-{lot_id}"))
    verified_weight = data.get("verifiedWeightKg", data.get("verified_weight_kg", weight_kg))
    vehicle = data.get("vehicleNumber", data.get("vehicle_number", "MH-12-QX-4891"))
    driver = data.get("driverName", data.get("driver_name", "Ramesh Shinde"))
    upi_id = data.get("upiId", data.get("upi_id", "sunil.kabadiwala@okhdfcbank"))

    cursor.execute("""
    INSERT INTO handovers (
        lot_id, material, weight_kg, recycler_name, recycler_id, location,
        date_time, final_value, payment_status, payment_method, handover_ref,
        confirmed, manifest_id, verified_weight_kg, vehicle_number, driver_name, upi_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(lot_id) DO UPDATE SET
        final_value=excluded.final_value,
        payment_status=excluded.payment_status,
        payment_method=excluded.payment_method,
        confirmed=excluded.confirmed,
        manifest_id=excluded.manifest_id,
        verified_weight_kg=excluded.verified_weight_kg,
        vehicle_number=excluded.vehicle_number,
        driver_name=excluded.driver_name,
        upi_id=excluded.upi_id
    """, (
        lot_id, material, weight_kg, recycler_name, recycler_id, location,
        date_time, final_value, payment_status, payment_method, handover_ref,
        confirmed, manifest_id, verified_weight, vehicle, driver, upi_id
    ))

    # If confirmed, mark lot as Completed & Paid
    if confirmed:
        cursor.execute("""
        UPDATE lots SET
            status = 'Completed',
            payment_status = 'Paid',
            completed_at = ?,
            weight_kg = ?,
            total_offer_value = ?
        WHERE lot_id = ?
        """, (date_time, verified_weight, final_value, lot_id))

    conn.commit()
    conn.close()
    return get_handover(lot_id)
