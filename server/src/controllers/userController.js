import { db } from '../config/firebase.js';

/**
 * Get profile of authenticated user
 * GET /api/v1/me
 */
export async function getProfile(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Please sign in.' },
      });
    }

    const docRef = db.collection('users').doc(uid);
    const snap = await docRef.get();

    if (!snap.exists) {
      // Create initial profile
      const initialProfile = {
        uid,
        email: req.user.email || '',
        name: req.user.name || '',
        phone: req.user.phone || '',
        role: req.user.role || 'customer',
        createdAt: new Date().toISOString(),
      };
      await docRef.set(initialProfile);
      return res.json({ success: true, data: initialProfile });
    }

    res.json({
      success: true,
      data: { uid, ...snap.data() },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 * PUT /api/v1/me
 */
export async function updateProfile(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Please sign in.' },
      });
    }

    const { name, phone } = req.body;
    const docRef = db.collection('users').doc(uid);
    const snap = await docRef.get();

    const updateData = {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(phone !== undefined ? { phone: phone.trim() } : {}),
      updatedAt: new Date().toISOString(),
    };

    if (!snap.exists) {
      await docRef.set({
        uid,
        email: req.user.email || '',
        role: 'customer',
        createdAt: new Date().toISOString(),
        ...updateData,
      });
    } else {
      await docRef.update(updateData);
    }

    const updatedSnap = await docRef.get();
    res.json({
      success: true,
      data: { uid, ...updatedSnap.data() },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get addresses for authenticated user
 * GET /api/v1/me/addresses
 */
export async function getAddresses(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Please sign in.' },
      });
    }

    const docRef = db.collection('users').doc(uid);
    const snap = await docRef.get();
    const data = snap.exists ? snap.data() : {};
    const addresses = data.addresses || [];

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add or update an address
 * POST /api/v1/me/addresses
 */
export async function saveAddress(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Please sign in.' },
      });
    }

    const { id, label, fullName, phone, line1, city, province, postalCode, isDefault } = req.body;

    const docRef = db.collection('users').doc(uid);
    const snap = await docRef.get();
    const existing = snap.exists ? snap.data() : { uid, addresses: [] };
    let addresses = existing.addresses || [];

    const addressId = id || 'addr_' + Date.now();
    const newAddr = {
      id: addressId,
      label: label || 'Home',
      fullName: fullName || existing.name || '',
      phone: phone || existing.phone || '',
      line1: line1 || '',
      city: city || 'Lahore',
      province: province || 'Punjab',
      postalCode: postalCode || '54000',
      isDefault: Boolean(isDefault),
    };

    if (newAddr.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }

    const existingIndex = addresses.findIndex((a) => a.id === addressId);
    if (existingIndex >= 0) {
      addresses[existingIndex] = { ...addresses[existingIndex], ...newAddr };
    } else {
      if (addresses.length === 0) newAddr.isDefault = true;
      addresses.push(newAddr);
    }

    await docRef.set({ ...existing, addresses, updatedAt: new Date().toISOString() }, { merge: true });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an address
 * DELETE /api/v1/me/addresses/:id
 */
export async function deleteAddress(req, res, next) {
  try {
    const uid = req.user?.uid;
    const { id } = req.params;

    if (!uid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Please sign in.' },
      });
    }

    const docRef = db.collection('users').doc(uid);
    const snap = await docRef.get();
    if (!snap.exists) {
      return res.json({ success: true, data: [] });
    }

    const data = snap.data();
    let addresses = (data.addresses || []).filter((a) => a.id !== id);

    await docRef.update({ addresses, updatedAt: new Date().toISOString() });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

