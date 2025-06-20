const Item = require('../models/Item');


exports.createItem = async (req, res) => {
    try {
        const { title, description, price, category, type, user} = req.body;

        const newItem = await Item.create(
            {
                title,
                description,
                price,
                category,
                type, // "sell", "rent", or "wanted"
                user: req.user.id, // From authMiddleware
            });
    
            res.status(201).json({
                message: "Item created successfully",
                item: newItem,
            })} catch (error) {
                console.error("Error creating item:", error);
                res.status(500).json({
                    message: "Internal server error",
                    error: error.message,
                });
            }
    };


exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find().populate('user', 'username email');
        res.status(200).json({
            message: "Items retrieved successfully",
            items,
        });
    } catch (error) {
        console.error("Error retrieving items:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

    exports.getItemById = async (req, res) => {

    try { 
    const item = await Item.findById(req.params.id).populate('user', 'username email');
    if (!item) return res.status(404).json({
        message: "Item not found",
    });
    res.json({item});
    } catch (error) {
    console.error("Error retrieving item:", error);
    res.status(500).json({
        message: "Internal server error",
        error: error.message,
    });
    }
    };

exports.updateItem = async (req, res) => {
    try {
        console.log("Update body received:", req.body);
        const item = await Item.findByIdAndUpdate(req.params.id);
        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }


        if(item.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this item",
            });
        }

        const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        console.log("After update:", updated);

        res.json({ message: "Item updated successfully", item: updated });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.deleteItem = async (req, res) => {

    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.buyItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item || item.type !== 'sell'){
            return res.status(404).json({
                message: "Item not found or not available for sale",
            });
        }
        if (item.sold) {
            return res.status(400).json({
                message: "Item has already been sold",
            });
        }

        if(item.user.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot buy your own item",
            });
        }

        item.sold = true;
        item.buyer = req.user.id; // Set the buyer to the current user 

        await item.save();

        res.json({
            message: "Item purchased successfully",
            item,
        });
    } catch (error) {
        console.error("Error purchasing item:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getMyPurchases = async (req, res) => {
  try {
    const purchases = await Item.find({ buyer: req.user.id })
      .populate('user', 'username email') // shows seller info
      .sort({ updatedAt: -1 });

    res.json(purchases);
  } catch (error) {
    console.error('Error getting purchases:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMySoldItems = async (req, res) => {
  try {
    const soldItems = await Item.find({ user: req.user.id, sold: true })
      .populate('buyer', 'username email')
      .sort({ updatedAt: -1 });

    res.json(soldItems);
  } catch (error) {
    console.error('Error fetching sold items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
