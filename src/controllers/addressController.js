import Address from '../models/Address.js';

export const createAddress = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            country,
            city,
            street,
            building,
            apartment,
            postalCode,
            isDefault
        } = req.body;


        if (isDefault) {
            await Address.updateMany(
                { user: req.user.id },
                { isDefault: false }
            );
        }

        // Check if this is the user's first address. If so, make it default automatically.
        const addressCount = await Address.countDocuments({ user: req.user.id });
        const makeDefault = addressCount === 0 ? true : isDefault || false;

        const address = new Address({
            user: req.user.id,
            fullName,
            phone,
            country,
            city,
            street,
            building,
            apartment,
            postalCode,
            isDefault: makeDefault
        });

        const savedAddress = await address.save();
        res.status(201).json({
            success: true,
            data: savedAddress
        });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};


export const getMyAddresses = async (req, res) => {
    try {
        // Sort to show the default address first, then by newest
        const addresses = await Address.find({ user: req.user.id })
            .sort({ isDefault: -1, createdAt: -1 });

        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


export const getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ 
                success: false,
                message: 'Address not found' });
        }

        // Ensure the address belongs to the logged-in user
        if (address.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized to view this address' });
        }

        res.status(200).json({
            success: true,
            data: address
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server Error' });
    }
};


export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ 
                success: false,
                message: 'Address not found' });
        }

        // Ensure ownership
        if (address.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Not authorized to update this address' });
        }

        // If setting this address to default, remove default from others
        if (req.body.isDefault && !address.isDefault) {
            await Address.updateMany(
                { user: req.user.id, id: { $ne: address.id } },
                { isDefault: false }
            );
        }

        address.fullName = req.body.fullName || address.fullName;
        address.phone = req.body.phone || address.phone;
        address.country = req.body.country || address.country;
        address.city = req.body.city || address.city;
        address.street = req.body.street || address.street;
        address.building = req.body.building || address.building;
        address.apartment = req.body.apartment !== undefined ? req.body.apartment : address.apartment;
        address.postalCode = req.body.postalCode !== undefined ? req.body.postalCode : address.postalCode;
        address.isDefault = req.body.isDefault !== undefined ? req.body.isDefault : address.isDefault;

        const updatedAddress = await address.save();
        res.status(200).json(updatedAddress);

    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};


export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        if (address.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this address' });
        }

        const wasDefault = address.isDefault;

        await address.deleteOne();

        // If the user deleted their default address, assign default to the most recently added address
        if (wasDefault) {
            const nextAddress = await Address.findOne({ user: req.user.id }).sort({ createdAt: -1 });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        res.status(200).json({ message: 'Address removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};