const Rental = require('../models/rental');
const Item = require('../models/Item');

exports.createRental = async (req, res) => {
    try {
        const {
            itemId,
            rentStart,
            rentEnd
        } = req.body;
console.log('Creating rental with data:', req.body);

        const userId = req.user.id;
        const item = await Item.findById(itemId);
        console.log('Found item:', item);

        if(!item || item.type !== 'rent') {
            return res.status(400).json({ message: 'Item not available for rent' });
        }

        if(item.user.toString() === userId) {
            return res.status(400).json({ message: 'You cannot rent your own item' });
        }

            // Calculate duration and cost
        const start = new Date(rentStart);
        const end = new Date(rentEnd);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const pricePerDay = item.price;
        const totalPrice = diffDays * pricePerDay;

         // Create rental record
         const rental = await Rental.create({
      item: item.id,
      owner: item.user,
      renter: userId,
      rentStart: start,
      rentEnd: end,
      pricePerDay,
      totalPrice
    });

    res.status(201).json({
        message: 'Rental created successfully',
        rental
    })
} catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getMyRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ renter: req.user.id })
        .populate('item', 'title imageUrl')
        .sort({rentStart: -1});

        res.json(rentals);
        console.log('Fetched rentals:', rentals);
    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.completeRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        console.log('Completing rental:', rental);
        if(!rental || rental.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Rental not found or unauthorized' });
        }

        rental.status = 'completed';
        await rental.save();

        res.json({ message: 'Rental completed successfully', rental });
} catch(error) {
    console.error('Error completing rental:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.cancelRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if(!rental || rental.renter.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Rental not found or unauthorized' });
        }

        // Only allow cancel if rental is still active and in future
    const now = new Date();
    if (rental.rentStart <= now) {
      return res.status(400).json({ message: 'Rental already started' });
    }

    rental.status = 'cancelled';
    await rental.save();

    res.json({ message: 'Rental cancelled successfully', rental });
    } catch (error) {
        console.error('Error cancelling rental:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};