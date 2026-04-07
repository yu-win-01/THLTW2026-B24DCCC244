import React, { useState, useMemo } from 'react';
import {
	Card,
	Row,
	Col,
	Button,
	Space,
	Typography,
	List,
	Tag,
	Modal,
	Form,
	Input,
	DatePicker,
	Select,
	message,
	Alert,
} from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	CalendarOutlined,
	DollarOutlined,
	ClockCircleOutlined,
	SwapOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import useTravelSystem from '@/models/listdulich';
import type { NgayTrongLichTrinh } from '@/models/listdulich';

const { Title, Text } = Typography;

const TaoLichTrinh: React.FC = () => {
	const { diemDen, lichTrinh, themLichTrinh, xoaLichTrinh, tinhTongChiPhi, tinhThoiGianDiChuyen } = useTravelSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [currentDays, setCurrentDays] = useState<NgayTrongLichTrinh[]>([]);

	const [filters, setFilters] = useState({
		idDiemDen: undefined as string | undefined,
		loaiHinh: undefined as string | undefined,
	});

	const filteredDiemDen = useMemo(() => {
		return diemDen.filter((dd) => {
			if (filters.idDiemDen && dd.id !== filters.idDiemDen) return false;
			if (filters.loaiHinh && dd.loaiHinh !== filters.loaiHinh) return false;
			return true;
		});
	}, [diemDen, filters]);

	const openCreateModal = () => {
		form.resetFields();
		setCurrentDays([{
			id: '1',
			ngay: 1,
			thu: 'Thứ 2',
			cacDiemDen: [],
		}]);
		setIsModalVisible(true);
	};

	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			const lichTrinhMoi = {
				ten: values.ten,
				ngayBatDau: values.ngayBatDau.format('YYYY-MM-DD'),
				ngayKetThuc: values.ngayKetThuc.format('YYYY-MM-DD'),
				nguoiDung: 'user',
				ngays: currentDays,
			};
			themLichTrinh(lichTrinhMoi);
			setIsModalVisible(false);
			message.success('Tạo lịch trình thành công');
		} catch (error) {
			message.error('Vui lòng kiểm tra dữ liệu');
		}
	};

	const addDay = () => {
		const newDay: NgayTrongLichTrinh = {
			id: Date.now().toString(),
			ngay: currentDays.length + 1,
			thu: `Thứ ${(currentDays.length + 1) % 8 || 1}`,
			cacDiemDen: [],
		};
		setCurrentDays([...currentDays, newDay]);
	};

	const addDiemDenToDay = (dayId: string, diemDenId: string) => {
		setCurrentDays(currentDays.map((day) => 
			day.id === dayId && !day.cacDiemDen.includes(diemDenId)
				? { ...day, cacDiemDen: [...day.cacDiemDen, diemDenId] }
				: day
		));
	};

	const removeDiemDenFromDay = (dayId: string, diemDenId: string) => {
		setCurrentDays(currentDays.map((day) => 
			day.id === dayId
				? { ...day, cacDiemDen: day.cacDiemDen.filter((id) => id !== diemDenId) }
				: day
		));
	};

	const moveDiemDen = (dayId: string, direction: 'up' | 'down', diemDenId: string) => {
		setCurrentDays(currentDays.map((day) => {
			if (day.id !== dayId) return day;
			const index = day.cacDiemDen.indexOf(diemDenId);
			if (direction === 'up' && index > 0) {
				const newList = [...day.cacDiemDen];
				[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
				return { ...day, cacDiemDen: newList };
			}
			if (direction === 'down' && index < day.cacDiemDen.length - 1) {
				const newList = [...day.cacDiemDen];
				[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
				return { ...day, cacDiemDen: newList };
			}
			return day;
		}));
	};

	const tongChiPhiTheoNgansach = useMemo(() => {
		let tong = 0;
		currentDays.forEach((ngay) => {
			ngay.cacDiemDen.forEach((idDD) => {
				const dd = diemDen.find((d) => d.id === idDD);
				if (dd) {
					tong += dd.chiPhi.anUong + dd.chiPhi.luuTru + dd.chiPhi.diChuyen;
				}
			});
		});
		return tong;
	}, [currentDays, diemDen]);

	const thoiGianDiChuyen = useMemo(() => {
		let tong = 0;
		currentDays.forEach((ngay, index) => {
			if (index > 0) {
				tong += 60;
			}
			ngay.cacDiemDen.forEach((idDD) => {
				const dd = diemDen.find((d) => d.id === idDD);
				if (dd) {
					tong += dd.thoiGianThamQuan;
				}
			});
		});
		return tong;
	}, [currentDays, diemDen]);

	const getDiemDenById = (id: string) => diemDen.find((dd) => dd.id === id);

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2} style={{ marginBottom: '24px' }}>
				<CalendarOutlined style={{ marginRight: 8 }} />
				Tạo lịch trình du lịch
			</Title>

			<Card style={{ marginBottom: '24px' }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12}>
						<Select
							placeholder='Lọc theo điểm đến'
							value={filters.idDiemDen}
							onChange={(value) => setFilters({ ...filters, idDiemDen: value })}
							allowClear
							showSearch
							style={{ width: '100%' }}
							options={diemDen.map((dd) => ({ value: dd.id, label: dd.ten }))}
						/>
					</Col>
					<Col xs={24} sm={12}>
						<Select
							placeholder='Loại hình'
							value={filters.loaiHinh}
							onChange={(value) => setFilters({ ...filters, loaiHinh: value })}
							allowClear
							style={{ width: '100%' }}
							options={[
								{ value: 'bien', label: 'Biển' },
								{ value: 'nui', label: 'Núi' },
								{ value: 'thanh_pho', label: 'Thành phố' },
							]}
						/>
					</Col>
				</Row>
			</Card>

			<Card
				title='Danh sách lịch trình'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={openCreateModal}>
						Tạo lịch trình mới
					</Button>
				}
			>
				<List
					dataSource={lichTrinh}
					renderItem={(lt) => {
						const tongChiPhi = tinhTongChiPhi(lt);
						const thoiGian = tinhThoiGianDiChuyen(lt);
						return (
							<List.Item
								actions={[
									<Button
										size='small'
										danger
										icon={<DeleteOutlined />}
										onClick={() => {
											xoaLichTrinh(lt.id);
											message.success('Xóa lịch trình thành công');
										}}
									/>,
								]}
							>
								<List.Item.Meta
									title={lt.ten}
									description={
										<Space direction='vertical'>
											<Text type='secondary'>
												{moment(lt.ngayBatDau).format('DD/MM/YYYY')} - {moment(lt.ngayKetThuc).format('DD/MM/YYYY')}
											</Text>
											<Space>
												<Tag icon={<CalendarOutlined />}>{lt.ngays.length} ngày</Tag>
												<Tag icon={<DollarOutlined />} color='green'>
													{new Intl.NumberFormat('vi-VN').format(tongChiPhi)} ₫
												</Tag>
												<Tag icon={<ClockCircleOutlined />} color='blue'>
													{Math.floor(thoiGian / 60)}h {thoiGian % 60}p
												</Tag>
											</Space>
										</Space>
									}
								/>
							</List.Item>
						);
					}}
				/>
			</Card>

			<Modal
				title='Tạo lịch trình mới'
				visible={isModalVisible}
				onOk={handleSave}
				onCancel={() => setIsModalVisible(false)}
				width={900}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Tên lịch trình'
						name='ten'
						rules={[{ required: true, message: 'Vui lòng nhập tên lịch trình' }]}
					>
						<Input placeholder='Ví dụ: Du lịch miền Trung' />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label='Ngày bắt đầu'
								name='ngayBatDau'
								rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
							>
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label='Ngày kết thúc'
								name='ngayKetThuc'
								rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
							>
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
				</Form>

				<Alert
					message={
						<Space>
							<DollarOutlined /> Tổng chi phí dự kiến:
							<Text strong style={{ color: '#52c41a' }}>
								{new Intl.NumberFormat('vi-VN').format(tongChiPhiTheoNgansach)} ₫
							</Text>
							<ClockCircleOutlined /> Thời gian:
							<Text strong>
								{Math.floor(thoiGianDiChuyen / 60)}h {thoiGianDiChuyen % 60}p
							</Text>
						</Space>
					}
					type='info'
					style={{ marginBottom: 16 }}
				/>

				<Card size='small' title='Lịch trình theo ngày'>
					<List
						dataSource={currentDays}
						renderItem={(item, index) => (
							<Card size='small' style={{ marginBottom: 12 }} type='inner'>
								<Space style={{ marginBottom: 8 }}>
									<Text strong>Ngày {index + 1}</Text>
									<Tag>{item.thu}</Tag>
									<Button size='small' type='link' onClick={addDay}>
										<PlusOutlined /> Thêm ngày
									</Button>
								</Space>
								<Select
									placeholder='Thêm điểm đến...'
									style={{ width: '100%', marginBottom: 8 }}
									allowClear
									showSearch
									onChange={(value) => value && addDiemDenToDay(item.id, value)}
									filterOption={(input, option) =>
										(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
									}
									options={filteredDiemDen.map((dd) => ({
										value: dd.id,
										label: dd.ten,
									}))}
								/>
								<List
									size='small'
									dataSource={item.cacDiemDen}
									renderItem={(ddId: string) => {
										const dd = getDiemDenById(ddId);
										if (!dd) return null;
										return (
											<List.Item
												style={{ padding: '8px', background: '#f5f5f5', marginBottom: 4, borderRadius: 4 }}
												actions={[
													<Button
														size='small'
														type='text'
														icon={<SwapOutlined rotate={90} />}
														onClick={() => moveDiemDen(item.id, 'up', ddId)}
													/>,
													<Button
														size='small'
														type='text'
														icon={<SwapOutlined rotate={-90} />}
														onClick={() => moveDiemDen(item.id, 'down', ddId)}
													/>,
													<Button
														size='small'
														type='text'
														danger
														icon={<DeleteOutlined />}
														onClick={() => removeDiemDenFromDay(item.id, ddId)}
													/>,
												]}
											>
												<Text>{dd.ten}</Text>
											</List.Item>
										);
									}}
								/>
							</Card>
						)}
					/>

					{currentDays.length === 0 && (
						<Button type='dashed' block icon={<PlusOutlined />} onClick={addDay}>
							Thêm ngày đầu tiên
						</Button>
					)}
				</Card>
			</Modal>
		</div>
	);
};

export default TaoLichTrinh;