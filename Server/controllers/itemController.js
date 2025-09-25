const Item = require("../models/Item");
const Order = require("../models/Order");
const supabase = require("../utils/supabaseClient");

exports.createItem = async (req, res) => {
  try {
    const { title, description, price, category, type } = req.body;
    const files = req.files || [];
    const sellerId = req.user?.id;

    if (!sellerId)
      return res.status(401).json({ message: "Not authenticated." });
    if (!title || !description || !category || !type) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Invalid price." });
    }
    if (files.length < 1 || files.length > 3) {
      return res
        .status(400)
        .json({ message: "At least 1 and at most 3 images required." });
    }

    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    for (const f of files) {
      if (!allowed.has(f.mimetype)) {
        return res
          .status(400)
          .json({ message: `Unsupported file type: ${f.mimetype}` });
      }
      if (f.size > 1_000_000) {
        return res.status(400).json({ message: "Each image must be < 1MB." });
      }
    }

    const bucket = "product-image";
    const uploaded = [];
    try {
      await Promise.all(
        files.map(async (file) => {
          const ext = (
            file.originalname.split(".").pop() || "jpg"
          ).toLowerCase();
          const fileName = `product-${sellerId}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
              upsert: false,
            });
          if (error) throw new Error(error.message);
          uploaded.push(fileName);
        })
      );
    } catch (e) {
      if (uploaded.length) await supabase.storage.from(bucket).remove(uploaded);
      return res
        .status(500)
        .json({ message: "Image upload failed.", error: e.message });
    }

    const imageUrls = uploaded.map(
      (name) =>
        `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${name}`
    );

    const newItem = await Item.create({
      title,
      description,
      price: numericPrice,
      category,
      type,
      imageUrls,
      seller: sellerId,
      status: "available",
      sold: false,
    });

    return res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    console.error("Error creating item:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("seller", "username email")
      .select("-__v")
      .lean();

    return res
      .status(200)
      .json({ message: "Items retrieved successfully", items });
  } catch (error) {
    console.error("Error retrieving items:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("seller", "username email")
      .select("-__v")
      .lean();

    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json({ item });
  } catch (error) {
    console.error("Error retrieving item:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user.id })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return res.json(items);
  } catch (error) {
    console.error("Error fetching user items:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.seller.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this item" });
    }

    const allowed = [
      "title",
      "description",
      "price",
      "category",
      "type",
      "status",
    ];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

    if ("price" in patch) {
      const np = Number(patch.price);
      if (!Number.isFinite(np) || np <= 0) {
        return res.status(400).json({ message: "Invalid price." });
      }
      patch.price = np;
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, patch, {
      new: true,
    }).populate("seller", "username email");

    return res.json({ message: "Item updated successfully", item: updated });
  } catch (error) {
    console.error("Error updating item:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.seller.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this item" });
    }

    const bucket = "product-image";
    const deletedPaths = (item.imageUrls || [])
      .map((url) => url.split(`/storage/v1/object/public/${bucket}/`)[1])
      .filter(Boolean);

    if (deletedPaths.length) {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove(deletedPaths);
      if (removeError) {
        console.warn(
          "Supabase image deletion failed:",
          removeError.message,
          deletedPaths
        );
      }
    }

    await item.deleteOne();
    return res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// exports.getMyPurchases = async (req, res) => {
//   try {
//     const purchases = await Item.find({ buyer: req.user.id })
//       .populate("user", "username email") // shows seller info
//       .sort({ updatedAt: -1 });

//     res.json(purchases);
//   } catch (error) {
//     console.error("Error getting purchases:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getMySoldItems = async (req, res) => {
//   try {
//     const soldItems = await Item.find({ user: req.user.id, sold: true })
//       .populate("buyer", "username email")
//       .sort({ updatedAt: -1 });

//     res.json(soldItems);
//   } catch (error) {
//     console.error("Error fetching sold items:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
