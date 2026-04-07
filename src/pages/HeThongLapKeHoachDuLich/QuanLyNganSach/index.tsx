import React, { useState, useMemo } from 'react';
import {
	Card,
	Row,
	Col,
	Button,
	Space,
	Typography,
	List,
	Modal,
	Form,
	InputNumber,
	message,
	Alert,
} from 'antd';
import {
	DollarOutlined,
	SaveOutlined,
	WarningOutlined,
	ExclamationCircleOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import useTravelSystem from '@/models/listdulich';

const { Title, Text } = Typography;

const COLORS = ['#1890ff', '#52c41a', '#faad14'];

const QuanLyNganSach: React.FC = () => {
	const { diemDen, lichTrinh, ngansach, capNhatNganSach } = useTravelSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	const openBudgetModal = () => {
		form.setFieldsValue(ngansach);
		setIsModalVisible(true);
	};

	const handleSaveBudget = async () => {
		try {
			const values = await form.validateFields();
			capNhatNganSach(values);
			setIsModalVisible(false);
			message.success('Cập nhật ngân sách thành công');
		} catch (error) {
			message.error('Vui lòng kiểm tra dữ liệu');
		}
	};

	const totalBudget = ngansach.anUong + ngansach.luuTru + ngansach.diChuyen;

	const chiPhiHienTai = useMemo(() => {
		let anUong = 0;
		let luuTru = 0;
		let diChuyen = 0;

		lichTrinh.forEach((lt) => {
			lt.ngays.forEach((ngay) => {
				ngay.cacDiemDen.forEach((idDD) => {
					const dd = diemDen.find((d) => d.id === idDD);
					if (dd) {
						anUong += dd.chiPhi.anUong;
						luuTru += dd.chiPhi.luuTru;
						diChuyen += dd.chiPhi.diChuyen;
					}
				});
			});
		});

		return { anUong, luuTru, diChuyen, tong: anUong + luuTru + diChuyen };
	}, [lichTrinh, diemDen]);

	const budgetAlert = useMemo(() => {
		const alerts: { type: 'warning' | 'error' | 'success'; message: string }[] = [];

		if (chiPhiHienTai.tong > totalBudget) {
			alerts.push({
				type: 'error',
				message: `Vượt ngân sách tổng: ${new Intl.NumberFormat('vi-VN').format(chiPhiHienTai.tong - totalBudget)} ₫`,
			});
		} else if (chiPhiHienTai.tong > totalBudget * 0.9) {
			alerts.push({
				type: 'warning',
				message: `Ngân sách sắp hết: chỉ còn ${new Intl.NumberFormat('vi-VN').format(totalBudget - chiPhiHienTai.tong)} ₫`,
			});
		}

		if (chiPhiHienTai.anUong > ngansach.anUong) {
			alerts.push({
				type: 'error',
				message: `Vượt ngân sách ăn uống: ${new Intl.NumberFormat('vi-VN').format(chiPhiHienTai.anUong - ngansach.anUong)} ₫`,
			});
		}
		if (chiPhiHienTai.luuTru > ngansach.luuTru) {
			alerts.push({
				type: 'error',
				message: `Vượt ngân sách lưu trú: ${new Intl.NumberFormat('vi-VN').format(chiPhiHienTai.luuTru - ngansach.luuTru)} ₫`,
			});
		}
		if (chiPhiHienTai.diChuyen > ngansach.diChuyen) {
			alerts.push({
				type: 'error',
				message: `Vượt ngân sách di chuyển: ${new Intl.NumberFormat('vi-VN').format(chiPhiHienTai.diChuyen - ngansach.diChuyen)} ₫`,
			});
		}

		if (alerts.length === 0) {
			alerts.push({
				type: 'success',
				message: 'Ngân sách trong tầm kiểm soát',
			});
		}

		return alerts;
	}, [chiPhiHienTai, ngansach, totalBudget]);

	const pieData = [
		{ name: 'Ăn uống', value: chiPhiHienTai.anUong },
		{ name: 'Lưu trú', value: chiPhiHienTai.luuTru },
		{ name: 'Di chuyển', value: chiPhiHienTai.diChuyen },
	];

	const budgetData = [
		{ name: 'Ngân sách', anUong: ngansach.anUong, luuTru: ngansach.luuTru, diChuyen: ngansach.diChuyen },
		{ name: 'Chi phí', anUong: chiPhiHienTai.anUong, luuTru: chiPhiHienTai.luuTru, diChuyen: chiPhiHienTai.diChuyen },
	];

	const barData = budgetData.map((item) => ({
		name: item.name,
		'Ăn uống': item.anUong,
		'Lưu trú': item.luuTru,
		'Di chuyển': item.diChuyen,
	}));

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2} style={{ marginBottom: '24px' }}>
				<DollarOutlined style={{ marginRight: 8 }} />
				Quản lý ngân sách
			</Title>

			<Card
				title='Cài đặt ngân sách'
				extra={
					<Button type='primary' icon={<SaveOutlined />} onClick={openBudgetModal}>
						Cập nhật ngân sách
					</Button>
				}
			>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={8}>
						<Card size='small' style={{ background: '#e6f7ff' }}>
							<Text type='secondary'>Ngân sách ăn uống</Text>
							<div>
								<Text strong style={{ fontSize: 24 }}>
									{new Intl.NumberFormat('vi-VN').format(ngansach.anUong)} ₫
								</Text>
							</div>
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card size='small' style={{ background: '#f6ffed' }}>
							<Text type='secondary'>Ngân sách lưu trú</Text>
							<div>
								<Text strong style={{ fontSize: 24 }}>
									{new Intl.NumberFormat('vi-VN').format(ngansach.luuTru)} ₫
								</Text>
							</div>
						</Card>
					</Col>
					<Col xs={24} sm={8}>
						<Card size='small' style={{ background: '#fffbe6' }}>
							<Text type='secondary'>Ngân sách di chuyển</Text>
							<div>
								<Text strong style={{ fontSize: 24 }}>
									{new Intl.NumberFormat('vi-VN').format(ngansach.diChuyen)} ₫
								</Text>
							</div>
						</Card>
					</Col>
				</Row>

				<Alert
					message={
						<Space>
							<Text strong>Tổng ngân sách: </Text>
							<Text strong style={{ fontSize: 18 }}>
								{new Intl.NumberFormat('vi-VN').format(totalBudget)} ₫
							</Text>
						</Space>
					}
					type='info'
					style={{ marginTop: 16 }}
				/>
			</Card>

			<Card title='Cảnh báo ngân sách' style={{ marginTop: 16 }}>
				<List
					dataSource={budgetAlert}
					renderItem={(item) => (
						<List.Item>
							<Alert
								message={item.message}
								type={item.type}
								icon={
									item.type === 'success' ? (
										<CheckCircleOutlined />
									) : item.type === 'warning' ? (
										<WarningOutlined />
									) : (
										<ExclamationCircleOutlined />
									)
								}
								showIcon
							/>
						</List.Item>
					)}
				/>
			</Card>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title='Phân bổ chi phí hiện tại'>
						<div style={{ height: 300 }}>
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={pieData}
										cx='50%'
										cy='50%'
										labelLine={false}
										label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
										outerRadius={80}
										fill='#8884d8'
										dataKey='value'
									>
										{pieData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value as number) + ' ₫'} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='So sánh ngân sách và chi phí'>
						<div style={{ height: 300 }}>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart data={barData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis />
									<Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value as number) + ' ₫'} />
									<Legend />
									<Bar dataKey='Ăn uống' fill={COLORS[0]} />
									<Bar dataKey='Lưu trú' fill={COLORS[1]} />
									<Bar dataKey='Di chuyển' fill={COLORS[2]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</Card>
				</Col>
			</Row>

			<Modal
				title='Cập nhật ngân sách'
				visible={isModalVisible}
				onOk={handleSaveBudget}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Ngân sách ăn uống'
						name='anUong'
						rules={[{ required: true, message: 'Vui lòng nhập ngân sách ăn uống' }]}
					>
						<InputNumber min={0} step={100000} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						label='Ngân sách lưu trú'
						name='luuTru'
						rules={[{ required: true, message: 'Vui lòng nhập ngân sách lưu trú' }]}
					>
						<InputNumber min={0} step={100000} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						label='Ngân sách di chuyển'
						name='diChuyen'
						rules={[{ required: true, message: 'Vui lòng nhập ngân sách di chuyển' }]}
					>
						<InputNumber min={0} step={100000} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyNganSach;