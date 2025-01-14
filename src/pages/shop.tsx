import { useState } from 'react';
import { Button, Card, message, Input, Pagination, Spin, Slider } from 'antd';
import { GoldFilled } from '@ant-design/icons';

interface Item {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

function ShopPage() {
  const [totalCoins, setTotalCoins] = useState(100); // Tổng coin người dùng có
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [searchTerm, setSearchTerm] = useState(''); // Tìm kiếm theo tên
  const [priceRange, setPriceRange] = useState([0, 100]); // Khoảng giá tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize] = useState(6); // Số vật phẩm mỗi trang

  const items: Item[] = [
    {
      id: 1,
      name: 'Voucher 10% Off',
      image: 'https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg',
      description: 'Voucher giảm giá 10% cho tất cả sản phẩm.',
      price: 20,
    },
    {
      id: 2,
      name: 'Free Coffee',
      image: 'https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg',
      description: 'Phần thưởng là một cốc cà phê miễn phí.',
      price: 30,
    },
    {
      id: 3,
      name: 'Gift Card $50',
      image: 'https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg',
      description: 'Thẻ quà tặng trị giá $50 cho các sản phẩm yêu thích.',
      price: 50,
    },
    {
      id: 4,
      name: 'Free T-shirt',
      image: 'https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg',
      description: 'T-shirt miễn phí với logo thương hiệu.',
      price: 40,
    },
    {
      id: 5,
      name: 'Gift Card $100',
      image: 'https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg',
      description: 'Thẻ quà tặng trị giá $100 cho các sản phẩm yêu thích.',
      price: 100,
    },
    {
      id: 6,
      name: 'Free Book',
      image: 'https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg',
      description: 'Một cuốn sách miễn phí.',
      price: 25,
    },
    {
      id: 7,
      name: 'Free Book',
      image: 'https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg',
      description: 'Một cuốn sách miễn phí.',
      price: 25,
    },
    // Thêm nhiều vật phẩm nếu cần
  ];

  // Lọc và tìm kiếm vật phẩm theo tên và giá
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    item.price >= priceRange[0] && item.price <= priceRange[1]
  );

  // Xử lý mua vật phẩm
  const handleBuyItem = (price: number, name: string) => {
    if (totalCoins >= price) {
      setLoading(true);
      setTimeout(() => {
        setTotalCoins(totalCoins - price);
        message.success(`Bạn đã mua thành công ${name}!`);
        setLoading(false);
      }, 1000); // Giả lập thời gian xử lý mua
    } else {
      message.error('Không đủ coin để mua vật phẩm này.');
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Danh sách vật phẩm hiển thị trên trang hiện tại
  const displayedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="pl-6 pr-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      <div className="grid grid-cols-5 gap-6 mb-4">
        <div className="flex flex-col pr-4 col-span-1">
          <div className="text-lg font-bold text-gray-700 mb-4">
            Total coins: <span className="text-blue-600">{totalCoins}</span>
            <GoldFilled className="inline-block text-yellow-500 ml-2" />
          </div>
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-4 w-full mb-4"
          />
          <Slider
            range
            min={0}
            max={100}
            value={priceRange}
            onChange={setPriceRange}
            className="w-full mb-4"
          />
          
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
          <Spin spinning={loading}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedItems.map((item) => (
                <div key={item.id} className="w-full">
                  <Card
                    hoverable
                    cover={<img alt={item.name} src={item.image} className="h-32 w-full object-cover rounded-lg" />}
                    className="bg-white shadow-lg rounded-lg"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 truncate">{item.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-lg font-semibold text-blue-600">Price: {item.price} coins</div>
                      <Button
                        type="primary"
                        onClick={() => handleBuyItem(item.price, item.name)}
                        disabled={totalCoins < item.price}
                      >
                        Buy
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Spin>

        </div>
      </div>
    </div>
  );
}

export default ShopPage;
