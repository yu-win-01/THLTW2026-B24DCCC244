import React, { useState } from 'react';
import {
	Table,
	Button,
	Space,
	Modal,
	Form,
	Input,
	Select,
	message,
	Card,
	Card as AntCard,
	Popconfirm,
	Row,
	Col,
	Tag,
	TimePicker,
	InputNumber,
	Divider,
	List,
	Empty,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { LichHeThong } from '@/models/quanlylichhen';
import useAppointmentSystem from '@/models/quanlylichhen';

const QuanLyNhanVien: React.FC = () => {
	const { nhanVien, dichVu, themNhanVien, capNhatNhanVien, xoaNhanVien } = useAppointmentSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<LichHeThong.NhanVien | null>(null);
	const [form] = Form.useForm();
	const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
	const [workingHours, setWorkingHours] = useState<LichHeThong.NhanVien['gioLamViec']>([]);
	const [currentDayOfWeek, setCurrentDayOfWeek] = useState<number>(0);
	const [currentStartTime, setCurrentStartTime] = useState<string | null>(null);
	const [currentEndTime, setCurrentEndTime] = useState<string | null>(null);

	const handleAddEmployee = () => {
		setSelectedEmployee(null);
		form.resetFields();
		setWorkingHours([]);
		setIsModalVisible(true);
	};

	const handleEditEmployee = (employee: LichHeThong.NhanVien) => {
		setSelectedEmployee(employee);
		form.setFieldsValue({
			ten: employee.ten,
			email: employee.email,
			dienThoai: employee.dienThoai,
			soLichHenToiDaTrongNgay: employee.soLichHenToiDaTrongNgay,
			dichVu: employee.dichVu,
			hoatDong: employee.dangHoatDong,
		});
		setWorkingHours(employee.gioLamViec || []);
		setIsModalVisible(true);
	};

	const handleSaveEmployee = async () => {
		try {
			const values = await form.validateFields();
			const employeeData = {
				...values,
				gioLamViec: workingHours,
				dangHoatDong: values.hoatDong || false,
				ngayTao: selectedEmployee?.ngayTao || Date.now(),
			};

			if (selectedEmployee) {
				capNhatNhanVien(selectedEmployee.id, employeeData);
				message.success('Cập nhật nhân viên thành công');
			} else {
				themNhanVien(employeeData);
				message.success('Thêm nhân viên thành công');
			}
			setIsModalVisible(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAddWorkingHour = () => {
		if (currentStartTime && currentEndTime) {
			const newWorkingHour = {
				ngayTrongTuan: currentDayOfWeek,
				gioBatDau: currentStartTime,
				gioKetThuc: currentEndTime,
			};
			setWorkingHours([...workingHours, newWorkingHour]);
			setCurrentDayOfWeek(0);
			setCurrentStartTime(null);
			setCurrentEndTime(null);
			message.success('Thêm giờ làm việc thành công');
		} else {
			message.error('Vui lòng chọn ngày và giờ');
		}
	};

	const handleRemoveWorkingHour = (index: number) => {
		setWorkingHours(workingHours.filter((_, i) => i !== index));
	};

	const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

	const columns = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			key: 'ten',
			align: 'center' as const,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			align: 'center' as const,
		},
		{
			title: 'ĐT',
			dataIndex: 'dienThoai',
			key: 'dienThoai',
			align: 'center' as const,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'dichVu',
			key: 'dichVu',
			render: (services: string[]) => {
				if (!services || services.length === 0) return 'Không';
				return services
					.map((id) => {
						const service = dichVu.find((s) => s.id === id);
						return service ? service.ten : id;
					})
					.join(', ');
			},
			align: 'center' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'dangHoatDong',
			key: 'dangHoatDong',
			render: (active: boolean) => (
				<Tag color={active ? 'green' : 'red'}>{active ? 'Hoạt động' : 'Không hoạt động'}</Tag>
			),
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: LichHeThong.NhanVien) => (
				<Space size='small'>
					<Button size='small' type='primary' icon={<EditOutlined />} onClick={() => handleEditEmployee(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa nhân viên?' okText='Có' cancelText='Không' onConfirm={() => xoaNhanVien(record.id)}>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
			align: 'center' as const,
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<Card title='Quản lý nhân viên'>
				<Space style={{ marginBottom: '16px' }}>
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAddEmployee}>
						Thêm nhân viên
					</Button>
					<Button
						onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
						type={viewMode === 'table' ? 'default' : 'primary'}
					>
						{viewMode === 'table' ? 'Xem dạng thẻ' : 'Xem dạng bảng'}
					</Button>
				</Space>

				{viewMode === 'table' ? (
					<Table
						dataSource={nhanVien}
						columns={columns}
						rowKey='id'
						pagination={{ pageSize: 10 }}
						scroll={{ x: true }}
					/>
				) : (
					<Row gutter={[16, 16]}>
						{nhanVien.length > 0 ? (
							nhanVien.map((employee) => (
								<Col key={employee.id} xs={24} sm={12} md={8} lg={6}>
									<AntCard
										title={employee.ten}
										size='small'
										extra={
											<Space>
												<Button size='small' type='link' onClick={() => handleEditEmployee(employee)}>
													<EditOutlined />
												</Button>
												<Popconfirm
													title='Xóa?'
													okText='Có'
													cancelText='Không'
													onConfirm={() => xoaNhanVien(employee.id)}
												>
													<Button size='small' type='link' danger>
														<DeleteOutlined />
													</Button>
												</Popconfirm>
											</Space>
										}
										style={{ height: '100%' }}
									>
										<p>
											<strong>Email:</strong> {employee.email}
										</p>
										<p>
											<strong>ĐT:</strong> {employee.dienThoai}
										</p>
										<p>
											<strong>Dịch vụ:</strong>{' '}
											{(employee.dichVu || [])
												.map((id) => {
													const service = dichVu.find((s) => s.id === id);
													return service ? service.ten : id;
												})
												.join(', ') || 'Không'}
										</p>
										<p>
											<Tag color={employee.dangHoatDong ? 'green' : 'red'}>
												{employee.dangHoatDong ? 'Hoạt động' : 'Không hoạt động'}
											</Tag>
										</p>
									</AntCard>
								</Col>
							))
						) : (
							<Col xs={24}>
								<Empty description='Không có nhân viên nào' />
							</Col>
						)}
					</Row>
				)}
			</Card>

			<Modal
				title={selectedEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
				visible={isModalVisible}
				onOk={handleSaveEmployee}
				onCancel={() => setIsModalVisible(false)}
				width={700}
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Tên nhân viên' name='ten' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
						<Input placeholder='Nhập tên nhân viên' />
					</Form.Item>
					<Form.Item
						label='Email'
						name='email'
						rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
					>
						<Input type='email' placeholder='Nhập email' />
					</Form.Item>
					<Form.Item
						label='Điện thoại'
						name='dienThoai'
						rules={[{ required: true, message: 'Vui lòng nhập điện thoại' }]}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>
					<Form.Item label='Dịch vụ' name='dichVu'>
						<Select
							mode='multiple'
							placeholder='Chọn dịch vụ'
							options={dichVu.map((s) => ({ value: s.id, label: s.ten }))}
						/>
					</Form.Item>
					<Form.Item label='Số lịch hẹn tối đa/ngày' name='soLichHenToiDaTrongNgay'>
						<InputNumber min={1} placeholder='Nhập số lịch hẹn' />
					</Form.Item>
					<Form.Item name='hoatDong' valuePropName='checked'>
						<div style={{ marginBottom: '10px' }}>
							<input type='checkbox' defaultChecked /> Hoạt động
						</div>
					</Form.Item>

					<Divider>Giờ làm việc</Divider>

					<Row
						gutter={[8, 8]}
						style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}
					>
						<Col xs={24} sm={8}>
							<Select
								value={currentDayOfWeek}
								onChange={setCurrentDayOfWeek}
								style={{ width: '100%' }}
								placeholder='Chọn ngày'
								options={daysOfWeek.map((day, idx) => ({ value: idx, label: day }))}
							/>
						</Col>
						<Col xs={24} sm={8}>
							<TimePicker
								value={currentStartTime ? moment(currentStartTime, 'HH:mm') : null}
								onChange={(time, timeString) => setCurrentStartTime(timeString)}
								format='HH:mm'
								placeholder='Giờ bắt đầu'
								style={{ width: '100%' }}
							/>
						</Col>
						<Col xs={24} sm={8}>
							<TimePicker
								value={currentEndTime ? moment(currentEndTime, 'HH:mm') : null}
								onChange={(time, timeString) => setCurrentEndTime(timeString)}
								format='HH:mm'
								placeholder='Giờ kết thúc'
								style={{ width: '100%' }}
							/>
						</Col>
						<Col xs={24}>
							<Button block type='primary' onClick={handleAddWorkingHour}>
								Thêm giờ làm việc
							</Button>
						</Col>
					</Row>

					{workingHours.length > 0 ? (
						<List
							dataSource={workingHours}
							renderItem={(hour, index) => (
								<List.Item
									key={index}
									extra={
										<Button size='small' danger onClick={() => handleRemoveWorkingHour(index)}>
											Xóa
										</Button>
									}
								>
									<List.Item.Meta
										title={`${daysOfWeek[hour.ngayTrongTuan]}`}
										description={`${hour.gioBatDau} - ${hour.gioKetThuc}`}
									/>
								</List.Item>
							)}
						/>
					) : (
						<Empty description='Chưa thêm giờ làm việc' style={{ margin: '20px 0' }} />
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyNhanVien;
