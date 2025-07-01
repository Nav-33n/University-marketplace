const Item = require('../models/Item');
const supabase = require('../utils/supabaseClient');

exports.createItem = async (req, res) => {
    try {
        const { title, description, price, category, type } = req.body;
        const files = req.files;
        const userId = req.user.id;

        console.log("BODY:", req.body);


     if (!files || files.length < 1 || files.length > 3) {
    return res.status(400).json({ message: "At least 1 and At most 3 image is required" });
        }
        
        const imageUrls = [];
        
        for (const file of files) {
    const ext = file.originalname.split('.').pop();
    const fileName = `product-${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from('product-image')
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) return res.status(500).json({ message: error.message });

    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/product-image/${fileName}`;
    imageUrls.push(imageUrl);
  }

        const newItem = await Item.create(
            {
                title,
                description,
                price: parseFloat(price),
                category,
                type, 
                imageUrls, 
                user: req.user.id
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
