import express from 'express';

const router = express.Router();

let menuItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        description: "Domates sosu, mozzarella, fesleğen",
        price: 85,
        category: "Pizza",
        available: true
    },
    {
        id: 2,
        name: "Caesar Salad",
        description: "Marul, parmesan, kruton, caesar sos",
        price: 45,
        category: "Salata",
        available: true
    },
    {
        id: 3,
        name: "Espresso",
        description: "İtalyan kahvesi",
        price: 15,
        category: "İçecek",
        available: true
    }
];

//Get all menu items
router.get('/', (req,res) => {
    res.json({
        success: true,
        data: menuItems,
        count: menuItems.length,
    });
});

//Get a single menu item by id
router.get('/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const item = menuItems.find(item => item.id === id);

    if(!item){
        return res.status(404).json({
            success: false,
            message: "Menu item not found",
        });
    }

    res.json({
        success: true,
        data: item,
    });
});

//Add a new menu item
router.post('/', (req, res) => {
    const { name, description, price, category } = req.body;
    
    // Simple validation
    if (!name || !price || !category || !description) {
        return res.status(400).json({
            success: false,
            message: 'Name and price are required!'
        });
    }
    
    const newItem = {
        id: Math.max(...menuItems.map(item => item.id)) + 1,
        name,
        description: description || "",
        price: parseFloat(price),
        category: category || "General",
        available: true
    };
    
    menuItems.push(newItem);
    
    res.status(201).json({
        success: true,
        message: 'Menu item added',
        data: newItem
    });
});

//Update a menu item (PUT) 
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description, price, category, available } = req.body;
    
    const itemIndex = menuItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Menu item not found'
        });
    }
    
    // Validation
    if (!name || !price) {
        return res.status(400).json({
            success: false,
            message: 'Name and price are required!'
        });
    }
    
    // Update the item
    menuItems[itemIndex] = {
        ...menuItems[itemIndex],
        name,
        description: description || "",
        price: parseFloat(price),
        category: category || "Genel",
        available: available !== undefined ? available : true
    };
    
    res.json({
        success: true,
        message: 'Menü öğesi güncellendi',
        data: menuItems[itemIndex]
    });
});

// Update only price (PATCH)
router.patch('/:id/price', (req, res) => {
    const id = parseInt(req.params.id);
    const { price } = req.body;
    
    if (!price || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Enter a valid price!'
        });
    }
    
    const itemIndex = menuItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Menu item not found'
        });
    }
    
    const oldPrice = menuItems[itemIndex].price;
    menuItems[itemIndex].price = parseFloat(price);
    
    res.json({
        success: true,
        message: `Price updated from ${oldPrice}₺ to ${price}₺`,
        data: menuItems[itemIndex]
    });
});

// Delete a menu item
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = menuItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Menu item not found'
        });
    }
    
    const deletedItem = menuItems[itemIndex];
    menuItems.splice(itemIndex, 1);
    
    res.json({
        success: true,
        message: `"${deletedItem.name}" deleted`,
        data: deletedItem
    });
});

// Get menu items by category
router.get('/category/:category', (req, res) => {
    const category = req.params.category;
    const categoryItems = menuItems.filter(item => 
        item.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({
        success: true,
        category: category,
        data: categoryItems,
        count: categoryItems.length
    });
});

export default router;