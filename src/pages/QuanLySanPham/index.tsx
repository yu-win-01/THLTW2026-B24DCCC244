import { Tabs, Statistic, Row, Col, Card, Progress, Badge } from 'antd';
import { ShoppingCartOutlined, AppstoreOutlined, DollarOutlined } from '@ant-design/icons';
import QuanLySanPham from './sanpham';
import QuanLyDonHang from './donhang';
import { useModel } from 'umi';
import type { Order } from '@/models/donhang';
import type { product } from '@/models/sanpham';

const { TabPane } = Tabs;

const QuanLy = () => {
	const { sanPham } = useModel('sanpham') as { sanPham: product[] };
	const { donhang } = useModel('donhang') as { donhang: Order[] };

	const tongSoSanPham = sanPham.length;
	const tongGiaTriTonKho = sanPham.reduce((total, sp) => total + sp.price * sp.quantity, 0);
	const tongSoDonHang = donhang.length;

	const donHangHoanThanh = donhang.filter((dh) => dh.status === 'completed' || dh.status === 'Hoàn thành');
	const doanhThu = donHangHoanThanh.reduce((total, dh) => total + (dh.totalAmount || 0), 0);

	const donHangTheoTrangThai = {
		pending: donhang.filter((dh) => dh.status === 'pending' || dh.status === 'Chờ xử lý').length,
		shipping: donhang.filter((dh) => dh.status === 'shipping' || dh.status === 'Đang giao').length,
		completed: donhang.filter((dh) => dh.status === 'completed' || dh.status === 'Hoàn thành').length,
		cancelled: donhang.filter((dh) => dh.status === 'cancelled' || dh.status === 'Đã hủy').length,
	};

	const tiLeHoanThanh = tongSoDonHang > 0 ? (donHangTheoTrangThai.completed / tongSoDonHang) * 100 : 0;

	return (
		<div style={{ padding: '24px', background: '#f0f2f5' }}>
			<h2 style={{ marginBottom: 24 }}>Dashboard Quản Lý</h2>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Tổng số sản phẩm'
							value={tongSoSanPham}
							prefix={<AppstoreOutlined />}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Tổng giá trị tồn kho'
							value={tongGiaTriTonKho}
							prefix={<DollarOutlined />}
							suffix='đ'
							valueStyle={{ color: '#cf1322' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Tổng số đơn hàng'
							value={tongSoDonHang}
							prefix={<ShoppingCartOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Doanh thu (Hoàn thành)'
							value={doanhThu}
							prefix={<DollarOutlined />}
							suffix='đ'
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} lg={12}>
					<Card title='Đơn hàng theo trạng thái' hoverable>
						<div style={{ marginBottom: 16 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
								<span>
									<Badge color='orange' /> Chờ xử lý
								</span>
								<span>{donHangTheoTrangThai.pending}</span>
							</div>
							<Progress
								percent={(donHangTheoTrangThai.pending / tongSoDonHang) * 100}
								strokeColor='orange'
								showInfo={false}
							/>
						</div>

						<div style={{ marginBottom: 16 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
								<span>
									<Badge color='blue' /> Đang giao
								</span>
								<span>{donHangTheoTrangThai.shipping}</span>
							</div>
							<Progress
								percent={(donHangTheoTrangThai.shipping / tongSoDonHang) * 100}
								strokeColor='blue'
								showInfo={false}
							/>
						</div>

						<div style={{ marginBottom: 16 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
								<span>
									<Badge color='green' /> Hoàn thành
								</span>
								<span>{donHangTheoTrangThai.completed}</span>
							</div>
							<Progress
								percent={(donHangTheoTrangThai.completed / tongSoDonHang) * 100}
								strokeColor='green'
								showInfo={false}
							/>
						</div>

						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
								<span>
									<Badge color='red' /> Đã hủy
								</span>
								<span>{donHangTheoTrangThai.cancelled}</span>
							</div>
							<Progress
								percent={(donHangTheoTrangThai.cancelled / tongSoDonHang) * 100}
								strokeColor='red'
								showInfo={false}
							/>
						</div>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card title='Tỷ lệ hoàn thành' hoverable>
						<Progress
							type='circle'
							percent={Math.round(tiLeHoanThanh)}
							strokeColor={{
								'0%': '#108ee9',
								'100%': '#87d068',
							}}
							style={{ display: 'flex', justifyContent: 'center' }}
						/>
						<div style={{ textAlign: 'center', marginTop: 16 }}>
							<p style={{ fontSize: 16, color: '#666' }}>
								{donHangTheoTrangThai.completed} / {tongSoDonHang} đơn hàng hoàn thành
							</p>
						</div>
					</Card>
				</Col>
			</Row>

			<Card>
				<Tabs defaultActiveKey='donhang'>
					<TabPane tab='Quản lý đơn hàng' key='donhang'>
						<QuanLyDonHang />
					</TabPane>

					<TabPane tab='Quản lý sản phẩm' key='sanpham'>
						<QuanLySanPham />
					</TabPane>
				</Tabs>
			</Card>
		</div>
	);
};

export default QuanLy;
