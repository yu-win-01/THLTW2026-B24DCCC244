import React, { useState } from 'react';
import {
	Table,
	Button,
	Space,
	Tag,
	Modal,
	Form,
	Input,
	Select,
	message,
	Card,
	Popconfirm,
	Row,
	Col,
	Tabs,
	Rate,
	Tooltip,
} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { LichHeThong } from '@/models/quanlylichhen';
import useAppointmentSystem from '@/models/quanlylichhen';

const LichHen: React.FC = () => {
	const {
		lichHen,
		dichVu,
		nhanVien,
		danhGia,
		capNhatTrangThaiLichHen,
		capNhatLichHen,
		xoaLichHen,
		themPhanHoiNhanVien,
	} = useAppointmentSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<LichHeThong.LichHen | null>(null);
	const [replyModalVisible, setReplyModalVisible] = useState(false);
	const [selectedRating, setSelectedRating] = useState<LichHeThong.DanhGiaLichHen | null>(null);
	const [replyForm] = Form.useForm();
	const [form] = Form.useForm();
	const [filters, setFilters] = useState({
		trangThai: undefined as string | undefined,
		idNhanVien: undefined as string | undefined,
		idDichVu: undefined as string | undefined,
	});

	const handleViewDetail = (appointment: LichHeThong.LichHen) => {
		setSelectedAppointment(appointment);
		form.setFieldsValue(appointment);
		setIsModalVisible(true);
	};

	const handleStatusChange = (appointmentId: string, newTrangThai: LichHeThong.LichHen['trangThai']) => {
		capNhatTrangThaiLichHen(appointmentId, newTrangThai);
	};

	const handleSaveDetail = async () => {
		try {
			const values = await form.validateFields();
			if (selectedAppointment) {
				capNhatLichHen(selectedAppointment.id, values);
				setIsModalVisible(false);
				setSelectedAppointment(null);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleReplyRating = (rating: LichHeThong.DanhGiaLichHen) => {
		setSelectedRating(rating);
		replyForm.setFieldsValue({
			phanHoi: rating.phanHoiNhanVien || '',
		});
		setReplyModalVisible(true);
	};

	const handleSaveReply = async () => {
		try {
			const values = await replyForm.validateFields();
			if (selectedRating) {
				themPhanHoiNhanVien(selectedRating.id, values.phanHoi);
				setReplyModalVisible(false);
				setSelectedRating(null);
				replyForm.resetFields();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const filteredAppointments = lichHen.filter((apt) => {
		if (filters.trangThai && apt.trangThai !== filters.trangThai) return false;
		if (filters.idNhanVien && apt.idNhanVien !== filters.idNhanVien) return false;
		if (filters.idDichVu && apt.idDichVu !== filters.idDichVu) return false;
		return true;
	});

	const statusColors: Record<string, string> = {
		cho_xu_ly: 'warning',
		da_xac_nhan: 'processing',
		hoan_thanh: 'success',
		da_huy: 'error',
	};

	const statusVN: Record<string, string> = {
		cho_xu_ly: 'Chờ xác nhận',
		da_xac_nhan: 'Đã xác nhận',
		hoan_thanh: 'Hoàn thành',
		da_huy: 'Hủy',
	};

	const columns = [
		{
			title: 'Khách hàng',
			dataIndex: 'tenKhachHang',
			key: 'tenKhachHang',
			align: 'center' as const,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'idDichVu',
			key: 'idDichVu',
			render: (idDichVu: string) => {
				const service = dichVu.find((s) => s.id === idDichVu);
				return service ? service.ten : idDichVu;
			},
			align: 'center' as const,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'idNhanVien',
			key: 'idNhanVien',
			render: (idNhanVien: string) => {
				const employee = nhanVien.find((e) => e.id === idNhanVien);
				return employee ? employee.ten : idNhanVien;
			},
			align: 'center' as const,
		},
		{
			title: 'Ngày hẹn',
			dataIndex: 'ngayLichHen',
			key: 'ngayLichHen',
			render: (date: string) => moment(date).format('DD/MM/YYYY'),
			align: 'center' as const,
		},
		{
			title: 'Giờ hẹn',
			dataIndex: 'gioLichHen',
			key: 'gioLichHen',
			align: 'center' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (trangThai: string, record: LichHeThong.LichHen) => (
				<Select
					value={trangThai}
					onChange={(newStatus) => handleStatusChange(record.id, newStatus as LichHeThong.LichHen['trangThai'])}
					style={{ width: '120px' }}
					options={[
						{ value: 'cho_xu_ly', label: 'Chờ xác nhận' },
						{ value: 'da_xac_nhan', label: 'Đã xác nhận' },
						{ value: 'hoan_thanh', label: 'Hoàn thành' },
						{ value: 'da_huy', label: 'Hủy' },
					]}
				/>
			),
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: LichHeThong.LichHen) => (
				<Space size='small'>
					<Button size='small' type='primary' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
						Chi tiết
					</Button>
					<Popconfirm title='Xóa lịch hẹn?' okText='Có' cancelText='Không' onConfirm={() => xoaLichHen(record.id)}>
						<Button size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
			align: 'center' as const,
		},
	];

	const ratingColumns = [
		{
			title: 'Khách hàng',
			dataIndex: 'idLichHen',
			key: 'customer',
			render: (idLichHen: string) => {
				const appointment = lichHen.find((a) => a.id === idLichHen);
				return appointment ? appointment.tenKhachHang : idLichHen;
			},
			align: 'center' as const,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'idLichHen',
			key: 'service',
			render: (idLichHen: string) => {
				const appointment = lichHen.find((a) => a.id === idLichHen);
				if (appointment) {
					const service = dichVu.find((s) => s.id === appointment.idDichVu);
					return service ? service.ten : appointment.idDichVu;
				}
				return '';
			},
			align: 'center' as const,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'idLichHen',
			key: 'employee',
			render: (idLichHen: string) => {
				const appointment = lichHen.find((a) => a.id === idLichHen);
				if (appointment) {
					const employee = nhanVien.find((e) => e.id === appointment.idNhanVien);
					return employee ? employee.ten : appointment.idNhanVien;
				}
				return '';
			},
			align: 'center' as const,
		},
		{
			title: 'Điểm đánh giá',
			dataIndex: 'diemDanhGia',
			key: 'diemDanhGia',
			render: (score: number) => <Rate disabled value={score} />,
			align: 'center' as const,
		},
		{
			title: 'Bình luận',
			dataIndex: 'binhLuan',
			key: 'binhLuan',
			render: (text: string) => <Tooltip title={text}>{text.substring(0, 30)}...</Tooltip>,
			align: 'center' as const,
		},
		{
			title: 'Phản hồi nhân viên',
			dataIndex: 'phanHoiNhanVien',
			key: 'phanHoiNhanVien',
			render: (text: string | undefined) => {
				if (!text) {
					return <Tag color='orange'>Chưa trả lời</Tag>;
				}
				return <Tooltip title={text}>{text.substring(0, 30)}...</Tooltip>;
			},
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: LichHeThong.DanhGiaLichHen) => (
				<Button size='small' type='primary' onClick={() => handleReplyRating(record)}>
					Trả lời
				</Button>
			),
			align: 'center' as const,
		},
	];

	return (
		<div style={{ padding: '20px' }}>
			<Card title='Quản lý lịch hẹn'>
				<Tabs>
					<Tabs.TabPane tab='Danh sách lịch hẹn' key='1'>
						<Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
							<Col xs={24} sm={12} md={6}>
								<Select
									allowClear
									placeholder='Trạng thái'
									value={filters.trangThai}
									onChange={(value) => setFilters({ ...filters, trangThai: value })}
									style={{ width: '100%' }}
									options={[
										{ value: 'cho_xu_ly', label: 'Chờ xác nhận' },
										{ value: 'da_xac_nhan', label: 'Đã xác nhận' },
										{ value: 'hoan_thanh', label: 'Hoàn thành' },
										{ value: 'da_huy', label: 'Hủy' },
									]}
								/>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Select
									allowClear
									placeholder='Nhân viên'
									value={filters.idNhanVien}
									onChange={(value) => setFilters({ ...filters, idNhanVien: value })}
									style={{ width: '100%' }}
									options={nhanVien.map((e) => ({ value: e.id, label: e.ten }))}
								/>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Select
									allowClear
									placeholder='Dịch vụ'
									value={filters.idDichVu}
									onChange={(value) => setFilters({ ...filters, idDichVu: value })}
									style={{ width: '100%' }}
									options={dichVu.map((s) => ({ value: s.id, label: s.ten }))}
								/>
							</Col>
							<Col xs={24} sm={12} md={6}>
								<Button
									block
									icon={<FilterOutlined />}
									onClick={() => setFilters({ trangThai: undefined, idNhanVien: undefined, idDichVu: undefined })}
								>
									Xóa bộ lọc
								</Button>
							</Col>
						</Row>

						<Table
							dataSource={filteredAppointments}
							columns={columns}
							rowKey='id'
							pagination={{ pageSize: 10 }}
							scroll={{ x: true }}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane tab='Đánh giá' key='2'>
						<Table
							dataSource={danhGia}
							columns={ratingColumns}
							rowKey='id'
							pagination={{ pageSize: 10 }}
							scroll={{ x: true }}
						/>
					</Tabs.TabPane>
				</Tabs>
			</Card>

			<Modal
				title='Chi tiết lịch hẹn'
				visible={isModalVisible}
				onOk={handleSaveDetail}
				onCancel={() => {
					setIsModalVisible(false);
					setSelectedAppointment(null);
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Tên khách hàng' name='tenKhachHang'>
						<Input disabled />
					</Form.Item>
					<Form.Item label='Email' name='emailKhachHang'>
						<Input disabled />
					</Form.Item>
					<Form.Item label='SĐT' name='dienThoaiKhachHang'>
						<Input disabled />
					</Form.Item>
					<Form.Item label='Ghi chú' name='ghiChu'>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Trả lời đánh giá'
				visible={replyModalVisible}
				onOk={handleSaveReply}
				onCancel={() => {
					setReplyModalVisible(false);
					setSelectedRating(null);
					replyForm.resetFields();
				}}
			>
				<Form form={replyForm} layout='vertical'>
					<Form.Item label='Bình luận'>
						<Input.TextArea value={selectedRating?.binhLuan} disabled rows={3} />
					</Form.Item>
					<Form.Item label='Phản hồi' name='phanHoi' rules={[{ required: true, message: 'Vui lòng nhập phản hồi' }]}>
						<Input.TextArea rows={3} placeholder='Nhập phản hồi của bạn' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default LichHen;
