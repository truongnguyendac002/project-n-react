import { useEffect, useState } from 'react';
import { Button, Card, message, Input, Pagination, Tooltip, Empty, Upload, Spin, Switch } from 'antd';
import { EditOutlined, PlusOutlined, PictureOutlined, GoldFilled, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { MdOutlineEditOff } from "react-icons/md";
import { IShopItem, ShopItemStatus } from '../models/ShopItem';
import { deleteShopItem, getShopItems, purchaseShopItem, uploadShopItemImage } from '../services/shopService';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/reduxHook';
import { IUserProfile } from '../models/User';
import ShopItemModal from '../components/shop/shopItemModal';
import { useDispatch } from 'react-redux';
import { purchaseItem } from '../redux/slices/authSlice';
import { motion } from 'framer-motion'; // Import Framer Motion

function ShopPage() {
  const user = useAppSelector<IUserProfile | null>((state) => state.auth.user);

  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [loadingFile, setLoadingFile] = useState(false); // Trạng thái loading file
  const [editting, setEditting] = useState(false); // Trạng thái chỉnh sửa
  const [initDone, setInitDone] = useState(false); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(''); // Tìm kiếm theo tên
  const [minPrice, setMinPrice] = useState(''); // Giá tối thiểu
  const [maxPrice, setMaxPrice] = useState(''); // Giá tối đa

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize] = useState(6); // Số vật phẩm mỗi trang
  const [shopItemModalVisible, setShopItemModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [editingItem, setEditingItem] = useState<IShopItem | undefined>(undefined); // Vật phẩm đang chỉnh sửa

  const [shopItems, setShopItems] = useState<IShopItem[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        setLoading(true);
        const response = await getShopItems();
        if (response.respCode === "000") {
          setShopItems(response.data);
        }
        else {
          message.error('Fetch shop items failed: ' + response.respDesc);
        }
      } catch (error) {
        console.error('Fetch shop items error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchShopItems();
      setInitDone(true);
    }

  }, [user]);

  // Lọc và tìm kiếm vật phẩm theo tên và giá
  const filteredItems = shopItems.filter(item => {
    const price = item.price;
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      price >= min &&
      price <= max
    );
  });

  // Danh sách vật phẩm hiển thị trên trang hiện tại
  const displayedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Xử lý mua vật phẩm
  const handleBuyItem = async (item: IShopItem) => {
    try {
      const response = await purchaseShopItem(item.id);
      if (response.respCode === "000") {
        dispatch(purchaseItem(item));
        setShopItems((prevItems) =>
          prevItems.map((i) => (i.id === item.id ? { ...item, status: ShopItemStatus.SOLD_OUT } : i))
        );
        message.success("Buy item successfully!");
      }
      else {
        message.error("Buy item fail!");
        console.log("Buy item fail!", response.respDesc);
      }
    } catch (error) {
      console.log("Buy item error!", error);
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddNewShopItem = () => {
    setEditingItem(undefined);
    setShopItemModalVisible(true);
  }

  const handleEditShopItem = (item: IShopItem) => {
    setEditingItem(item);
    setShopItemModalVisible(true);
  }

  const handleSaveShopItem = (item: IShopItem) => {
    if (editingItem) {
      setShopItems((prevItems) =>
        prevItems.map((i) => (i.id === item.id ? item : i))
      );
    } else {
      setShopItems((prevItems) => [...prevItems, item]);
    }
    setShopItemModalVisible(false);
  }

  const handleDeleteShopItem = async (item: IShopItem) => {
    try {
      const response = await deleteShopItem(item.id);
      if (response.respCode === "000") {
        message.success("Delete item successfully!");
        const newItemList = shopItems.filter(i => i.id !== item.id);
        setShopItems(newItemList);
      }
      else {
        message.error("Delete item fail!");
        console.log("Delete item fail!", response.respDesc);
      }
    } catch (error) {
      console.log("Delete item error!", error);
    }
  }

  const handlePicture = async (file: File, item: IShopItem) => {
    try {
      setLoadingFile(true);
      const response = await uploadShopItemImage(item.id, file);
      if (response.respCode === "000") {
        message.success("Upload image successfully!");
        setShopItems((prevItems) => {
          return prevItems.map((i) => (i.id === item.id ? response.data as IShopItem : i));
        }
        );
      }
      else {
        message.error("Upload image fail!" + response.data as string);
        console.log("Upload image fail!", response.respDesc);
      }
    } catch (error) {
      console.log("Upload image error!", error);
    } finally {
      setLoadingFile(false);
    }
  }

  return (
    <div className="pl-6 pr-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      <div className="grid grid-cols-5 gap-6 mb-4">
        <div className="flex flex-col pr-4 col-span-1">
          <div className="text-lg font-bold text-gray-700 mb-4">
            Total coins: <span className="text-blue-600">{user?.wallet}</span>
            <GoldFilled className="inline-block text-yellow-500 ml-2" />
          </div>
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-4 w-full mb-4"
          />

          <div className="flex mb-4">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="mr-2 w-1/2"
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2"
            />
          </div>


          {/* Phân trang */}
          <Pagination
            current={currentPage}
            total={filteredItems.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            className="mt-6"
          />
        </div>

        {/* Cột bên phải: Vật phẩm */}
        <div className="col-span-4">
          <Card
            loading={(loading && !initDone)}
            title="Default size card" extra={
              <>
                <Tooltip title="New item">
                  <button onClick={handleAddNewShopItem} className='mr-4' ><PlusOutlined /></button>
                </Tooltip>
                <Tooltip title="Edit item">
                  <Switch
                    checkedChildren={<EditOutlined />}
                    unCheckedChildren={<MdOutlineEditOff className='mt-1' />}
                    onClick={() => setEditting(!editting)}
                  />
                </Tooltip>

              </>}
          >
            {displayedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={item.status === ShopItemStatus.SOLD_OUT ? { opacity: 0.5, scale: 0.9 } : {}}
                    className="w-full"
                  >
                    <Card
                      hoverable
                      cover={
                        <div className="relative">
                          <img
                            alt={item.name}
                            src={item.imageUrl ? item.imageUrl : "https://www.minteventrentals.com/templates/mint/images/noproductfound.png"}
                            className="h-32 w-full object-cover rounded-lg"
                          />
                          {item.status === ShopItemStatus.SOLD_OUT && (
                            <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-lg">
                              <p className="text-white text-xl font-bold">SOLD OUT</p>
                            </div>
                          )}
                        </div>
                      }
                      className="bg-white shadow-lg rounded-lg"
                      actions={editting ? [
                        <Tooltip
                          title={item.status === ShopItemStatus.SOLD_OUT ? "Cannot edit sold items" : "Edit image"}
                        >
                          <span>
                            <Upload
                              showUploadList={false}
                              disabled={item.status === ShopItemStatus.SOLD_OUT}
                              beforeUpload={(file) => {
                                handlePicture(file, item);
                                return false;
                              }}
                            >
                              {loadingFile ? (
                                <Spin
                                  indicator={
                                    <LoadingOutlined spin />
                                  }
                                />
                              ) : (
                                <PictureOutlined className={item.status === ShopItemStatus.SOLD_OUT ? "text-gray-400 cursor-not-allowed" : ""}
                                />
                              )}
                            </Upload>
                          </span>
                        </Tooltip>,
                        <Tooltip
                          title={item.status === ShopItemStatus.SOLD_OUT ? "Cannot edit sold items" : ""}
                        >
                          <span>
                            <EditOutlined
                              key="edit"
                              onClick={() => {
                                if (item.status !== ShopItemStatus.SOLD_OUT) handleEditShopItem(item);
                              }}
                              className={item.status === ShopItemStatus.SOLD_OUT ? "text-gray-400 cursor-not-allowed" : ""}
                            />
                          </span>
                        </Tooltip>,
                        <Tooltip
                          title={item.status === ShopItemStatus.SOLD_OUT ? "Cannot delete sold items" : ""}
                        >
                          <span>
                            <DeleteOutlined
                              key="delete"
                              onClick={() => {
                                if (item.status !== ShopItemStatus.SOLD_OUT) handleDeleteShopItem(item);
                              }}
                              className={item.status === ShopItemStatus.SOLD_OUT ? "text-gray-400 cursor-not-allowed" : "text-red-500 hover:text-red-600"}
                            />
                          </span>
                        </Tooltip>,
                      ] : []}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 truncate">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-lg w-4/5 font-semibold text-blue-600">
                          Price: {item.price} coins
                        </div>
                        <Button
                          type="primary"
                          className="flex-1"
                          onClick={() => handleBuyItem(item)}
                          disabled={user?.wallet as number < item.price || item.status === ShopItemStatus.SOLD_OUT}
                        >
                          {item.status === ShopItemStatus.SOLD_OUT ? "Sold Out" : "Buy"}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>

                ))}
              </div>)
              : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Empty description={<span>No items available in the shop</span>} />
                  <Button type="primary" className="mt-4" onClick={handleAddNewShopItem}>
                    Add New Item
                  </Button>
                </div>
              )
            }

          </Card>

        </div>
      </div>

      <ShopItemModal visible={shopItemModalVisible} onCancel={() => setShopItemModalVisible(false)} onSave={handleSaveShopItem} editingItem={editingItem} />
    </div>
  );
}

export default ShopPage;
