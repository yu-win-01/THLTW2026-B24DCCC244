import React, { useState } from 'react';
import {
	Card,
	Row,
	Col,
	Button,
	Space,
	Typography,
	Table,
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	message,
	Popconfirm,
	Tabs,
	Statistic,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	LineChartOutlined,
	GlobalOutlined,
	CarOutlined,
	BankOutlined,
	DatabaseOutlined,
	EnvironmentOutlined,
} from '@ant-design/icons';
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import useTravelSystem from '@/models/listdulich';
import type { DiemDen } from '@/models/listdulich';

const { Title, Text } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TrangAdmin: React.FC = () => {
	const { diemDen, themDiemDen, capNhatDiemDen, xoaDiemDen, thongKeAdmin } = useTravelSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	const handleOpenModal = (record?: DiemDen) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue(record);
		} else {
			setEditingId(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};

	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			if (editingId) {
				capNhatDiemDen(editingId, values);
				message.success('Cập nhật thành công');
			} else {
				themDiemDen(values);
				message.success('Thêm mới thành công');
			}
			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			message.error('Vui lòng kiểm tra dữ liệu');
		}
	};

	const columns = [
		{
			title: 'Tên điểm đến',
			dataIndex: 'ten',
			key: 'ten',
			align: 'center' as const,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			key: 'diaChi',
			align: 'center' as const,
		},
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinh',
			key: 'loaiHinh',
			align: 'center' as const,
			render: (loaiHinh: string) => {
				const config: Record<string, { color: string; text: string }> = {
					bien: { color: 'blue', text: 'Biển' },
					nui: { color: 'green', text: 'Núi' },
					thanh_pho: { color: 'purple', text: 'Thành phố' },
				};
				const c = config[loaiHinh] || { color: 'default', text: loaiHinh };
				return <span style={{ color: c.color }}>{c.text}</span>;
			},
		},
		{
			title: 'Giá',
			dataIndex: 'gia',
			key: 'gia',
			align: 'center' as const,
			render: (gia: number) => new Intl.NumberFormat('vi-VN').format(gia) + ' ₫',
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			key: 'rating',
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: DiemDen) => (
				<Space size='small'>
					<Button size='small' type='primary' icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa điểm đến?' okText='Có' cancelText='Không' onConfirm={() => xoaDiemDen(record.id)}>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const thangLabels = [
		'Tháng 1',
		'Tháng 2',
		'Tháng 3',
		'Tháng 4',
		'Tháng 5',
		'Tháng 6',
		'Tháng 7',
		'Tháng 8',
		'Tháng 9',
		'Tháng 10',
		'Tháng 11',
		'Tháng 12',
	];

	const thongKeData = {
		lichTrinhTheoThang: Array.from({ length: 12 }, (_, i) => {
			const item = thongKeAdmin.soLichTrinhTaoTheoThang.find((t) => t.thang === i + 1);
			return { month: thangLabels[i], soLuong: item?.soLuong || 0 };
		}),
		diaDiemPhoBien: thongKeAdmin.diaDiemPhoBien,
		thuTheoHangMuc: thongKeAdmin.thuTheoHangMuc,
	};

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2} style={{ marginBottom: '24px' }}>
				{<DatabaseOutlined />}
				Trang Quản trị ADMIN
			</Title>

			<Tabs>
				<Tabs.TabPane tab={<span> {<EnvironmentOutlined />}Quản lý điểm đến </span>} key='1'>
					<Card
						title='Danh sách điểm đến'
						extra={
							<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
								Thêm điểm đến
							</Button>
						}
					>
						<Table
							dataSource={diemDen}
							columns={columns}
							rowKey='id'
							pagination={{ pageSize: 10 }}
							scroll={{ x: true }}
						/>
					</Card>

					<Modal
						title={editingId ? 'Sửa điểm đến' : 'Thêm điểm đến'}
						visible={isModalVisible}
						onOk={handleSave}
						onCancel={() => {
							setIsModalVisible(false);
							form.resetFields();
						}}
						width={600}
					>
						<Form form={form} layout='vertical'>
							<Form.Item label='Tên điểm đến' name='ten' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
								<Input />
							</Form.Item>
							<Form.Item label='Hình ảnh' name='hinhAnh'>
								<Input placeholder='URL hình ảnh' />
							</Form.Item>
							<Form.Item label='Địa chỉ' name='diaChi' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
								<Input />
							</Form.Item>
							<Form.Item label='Mô tả' name='moTa'>
								<Input.TextArea rows={3} />
							</Form.Item>
							<Form.Item
								label='Loại hình'
								name='loaiHinh'
								rules={[{ required: true, message: 'Vui lòng chọn loại hình' }]}
							>
								<Select
									options={[
										{ value: 'bien', label: 'Biển' },
										{ value: 'nui', label: 'Núi' },
										{ value: 'thanh_pho', label: 'Thành phố' },
									]}
								/>
							</Form.Item>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item label='Giá' name='gia' rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
										<InputNumber min={0} step={100000} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Rating' name='rating'>
										<InputNumber min={0} max={5} step={0.5} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Thời gian (phút)' name='thoiGianThamQuan'>
										<InputNumber min={0} step={15} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							</Row>
							<Title level={5}>Chi phí</Title>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item label='Ăn uống' name={['chiPhi', 'anUong']}>
										<InputNumber min={0} step={50000} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Lưu trú' name={['chiPhi', 'luuTru']}>
										<InputNumber min={0} step={50000} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Di chuyển' name={['chiPhi', 'diChuyen']}>
										<InputNumber min={0} step={50000} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Modal>
				</Tabs.TabPane>

				<Tabs.TabPane tab={<span> {<LineChartOutlined />}Thống kê </span>} key='2'>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic
									title='Tổng số lịch trình'
									value={thongKeAdmin.soLichTrinhTaoTheoThang.reduce((a, b) => a + b.soLuong, 0)}
									prefix={<LineChartOutlined />}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic
									title='Tổng doanh thu'
									value={thongKeAdmin.tongThu}
									prefix={<BankOutlined />}
									formatter={(value) => new Intl.NumberFormat('vi-VN').format(value as number) + ' ₫'}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic title='Số điểm đến' value={diemDen.length} prefix={<GlobalOutlined />} />
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card>
								<Statistic
									title='Số địa điểm phổ biến'
									value={thongKeAdmin.diaDiemPhoBien.length}
									prefix={<CarOutlined />}
								/>
							</Card>
						</Col>
					</Row>

					<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
						<Col xs={24} lg={12}>
							<Card title='Số lịch trình theo tháng'>
								<div style={{ height: 300 }}>
									<ResponsiveContainer width='100%' height='100%'>
										<BarChart data={thongKeData.lichTrinhTheoThang}>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='month' />
											<YAxis />
											<Tooltip />
											<Bar dataKey='soLuong' fill='#1890ff' name='Số lịch trình' />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</Card>
						</Col>
						<Col xs={24} lg={12}>
							<Card title='Địa điểm phổ biến'>
								<div style={{ height: 300 }}>
									{thongKeData.diaDiemPhoBien.length > 0 ? (
										<ResponsiveContainer width='100%' height='100%'>
											<PieChart>
												<Pie
													data={thongKeData.diaDiemPhoBien}
													cx='50%'
													cy='50%'
													labelLine={false}
													label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
													outerRadius={80}
													fill='#8884d8'
													dataKey='soLuong'
													nameKey='ten'
												>
													{thongKeData.diaDiemPhoBien.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
													))}
												</Pie>
												<Tooltip />
											</PieChart>
										</ResponsiveContainer>
									) : (
										<Text type='secondary'>Chưa có dữ liệu</Text>
									)}
								</div>
							</Card>
						</Col>
					</Row>

					<Card title='Doanh thu theo hạng mục' style={{ marginTop: 16 }}>
						<div style={{ height: 300 }}>
							{thongKeData.thuTheoHangMuc.length > 0 ? (
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={thongKeData.thuTheoHangMuc}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis
											dataKey='ten'
											tickFormatter={(value) => {
												const map: Record<string, string> = {
													anUong: 'Ăn uống',
													luuTru: 'Lưu trú',
													diChuyen: 'Di chuyển',
												};
												return map[value] || value;
											}}
										/>
										<YAxis />
										<Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value as number) + ' ₫'} />
										<Bar dataKey='soTien' fill='#52c41a' name='Doanh thu' />
									</BarChart>
								</ResponsiveContainer>
							) : (
								<Text type='secondary'>Chưa có dữ liệu</Text>
							)}
						</div>
					</Card>
				</Tabs.TabPane>
			</Tabs>
		</div>
	);
};

export default TrangAdmin;
