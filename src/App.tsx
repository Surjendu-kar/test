import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getStoredInventory,
  updateItem,
  deleteItem,
  addItem,
  getCategories,
} from "./utils/inventoryUtils";
import Header from "./components/Header";
import InventoryFilters from "./components/InventoryFilters";
import InventoryTable from "./components/InventoryTable";
import InventoryModal from "./components/InventoryModal";
import ConfirmDialog from "./components/ConfirmDialog";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const App = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filters, setFilters] = useState<InventoryFilters>({
    category: "",
    sortBy: "name",
    sortOrder: "asc",
    search: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId: string | null;
  }>({ isOpen: false, itemId: null });

  useEffect(() => {
    setItems(getStoredInventory());
    setCategories(getCategories());
  }, []);

  const handleAddItem = (
    newItem: Omit<InventoryItem, "id" | "lastUpdated">
  ) => {
    const item = addItem(newItem);
    setItems((prev) => [...prev, item]);
    setIsAddModalOpen(false);
  };

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    const itemWithNewTimestamp = {
      ...updatedItem,
      lastUpdated: new Date().toISOString(),
    };
    updateItem(itemWithNewTimestamp);
    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? itemWithNewTimestamp : item
      )
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setDeleteConfirmation({ isOpen: true, itemId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.itemId) {
      deleteItem(deleteConfirmation.itemId);
      setItems((prev) =>
        prev.filter((item) => item.id !== deleteConfirmation.itemId)
      );
      setDeleteConfirmation({ isOpen: false, itemId: null });
    }
  };

  const filteredItems = items
    .filter(
      (item) =>
        (!filters.category || item.category === filters.category) &&
        (!filters.search ||
          item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.category.toLowerCase().includes(filters.search.toLowerCase()))
    )
    .sort((a, b) => {
      const order = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "quantity")
        return (a.quantity - b.quantity) * order;
      if (filters.sortBy === "price") return (a.price - b.price) * order;
      if (filters.sortBy === "lastUpdated") {
        return (
          (new Date(a.lastUpdated).getTime() -
            new Date(b.lastUpdated).getTime()) *
          order
        );
      }
      return a[filters.sortBy].localeCompare(b[filters.sortBy]) * order;
    });

  const handleModalSubmit = (formData: FormData) => {
    const itemData = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
    };

    if (editingItem) {
      handleUpdateItem({
        ...itemData,
        id: editingItem.id,
        lastUpdated: editingItem.lastUpdated,
      });
    } else {
      handleAddItem(itemData);
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants}>
          <Header onAddClick={() => setIsAddModalOpen(true)} />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <motion.div variants={itemVariants}>
            <InventoryFilters
              filters={filters}
              categories={categories}
              onFilterChange={setFilters}
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            layout
          >
            <InventoryTable
              items={filteredItems}
              onEdit={setEditingItem}
              onDelete={handleDeleteItem}
            />
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {(isAddModalOpen || editingItem !== null) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <InventoryModal
              isOpen={isAddModalOpen || editingItem !== null}
              editingItem={editingItem}
              categories={categories}
              onClose={handleModalClose}
              onSubmit={handleModalSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {deleteConfirmation.isOpen && (
        <ConfirmDialog
          isOpen={deleteConfirmation.isOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeleteConfirmation({ isOpen: false, itemId: null })
          }
        />
      )}
    </motion.div>
  );
};

export default App;
