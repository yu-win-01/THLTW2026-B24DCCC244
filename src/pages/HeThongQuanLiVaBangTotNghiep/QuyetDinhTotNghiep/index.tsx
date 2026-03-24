import React, { useState } from 'react';
import {
	Table,
	Button,
	Space,
	Tag,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	message,
	Card,
	Popconfirm,
	Row,
	Col,
	Drawer,
	Divider,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyVanBang } from '@/models/quanlyvanbang';
import useDocumentManagementSystem from '@/models/quanlyvanbang';

const QuyetDinhTotNghiep: React.FC = () => {
	const { quyetDinh, soVanBang, themQuyetDinh, capNhatQuyetDinh, xoaQuyetDinh } = useDocumentManagementSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<QuanLyVanBang.QuyetDinhTotNghiep | null>(null);
	const [form] = Form.useForm();

	const handleOpenModal = (record?: QuanLyVanBang.QuyetDinhTotNghiep) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				soQuyetDinh: record.soQuyetDinh,
				ngayBanHanh: record.ngayBanHanh,
				trichYeu: record.trichYeu,
				idSoVanBang: record.idSoVanBang,
				soLuongSinhVienTotNghiep: record.soLuongSinhVienTotNghiep,
				trangThai: record.trangThai,
				ghiChu: record.ghiChu,
			});
		} else {
			setEditingId(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (editingId) {
				const success = capNhatQuyetDinh(editingId, values);

				if (success) {
					message.success('Cập nhật quyết định thành công');
					setIsModalVisible(false);
				} else {
					message.error('Cập nhật quyết định thất bại');
				}
			} else {
				const success = themQuyetDinh(values);

				if (success) {
					message.success('Thêm quyết định thành công');
					setIsModalVisible(false);
				} else {
					message.error('Thêm quyết định thất bại');
				}
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleDelete = (id: string) => {
		if (xoaQuyetDinh(id)) {
			message.success('Xóa quyết định thành công');
		} else {
			message.error('Xóa quyết định thất bại');
		}
	};

	const handleViewDetail = (record: QuanLyVanBang.QuyetDinhTotNghiep) => {
		setSelectedRecord(record);
		setIsDetailDrawerVisible(true);
	};

	const getSoVanBangName = (id: string) => {
		const so = soVanBang.find((s) => s.id === id);
		return so ? `Sổ ${so.nam} - ${so.soHieuSo}` : 'N/A';
	};

	const columns = [
		{
			title: 'Số Quyết Định',
			dataIndex: 'soQuyetDinh',
			key: 'soQuyetDinh',
			align: 'center' as const,
		},
		{
			title: 'Ngày Ban Hành',
			dataIndex: 'ngayBanHanh',
			key: 'ngayBanHanh',
			render: (text: string) => moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY'),
			align: 'center' as const,
		},
		{
			title: 'Sổ Văn Bằng',
			dataIndex: 'idSoVanBang',
			key: 'idSoVanBang',
			render: (text: string) => getSoVanBangName(text),
			align: 'center' as const,
		},
		{
			title: 'SV Tốt Nghiệp',
			dataIndex: 'soLuongSinhVienTotNghiep',
			key: 'soLuongSinhVienTotNghiep',
			align: 'center' as const,
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (text: string) => {
				const statusMap: Record<string, { color: string; label: string }> = {
					nhap: { color: 'blue', label: 'Nhập' },
					hoat_dong: { color: 'green', label: 'Hoạt động' },
					da_ket_thuc: { color: 'red', label: 'Đã kết thúc' },
				};
				return <Tag color={statusMap[text]?.color}>{statusMap[text]?.label}</Tag>;
			},
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: QuanLyVanBang.QuyetDinhTotNghiep) => (
				<Space size='middle'>
					<Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} title='Xem chi tiết' />
					<Button type='text' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} title='Chỉnh sửa' />
					<Popconfirm title='Xóa quyết định' onConfirm={() => handleDelete(record.id)} okText='Có' cancelText='Không'>
						<Button type='text' danger icon={<DeleteOutlined />} title='Xóa' />
					</Popconfirm>
				</Space>
			),
			align: 'center' as const,
		},
	];

	return (
		<Card>
			<Row justify='space-between' align='middle' style={{ marginBottom: '16px' }}>
				<Col>
					<h2>Quản lý Quyết Định Tốt Nghiệp</h2>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm quyết định
					</Button>
				</Col>
			</Row>

			<Table
				columns={columns as any}
				dataSource={quyetDinh}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1200 }}
			/>

			<Modal
				title={editingId ? 'Chỉnh sửa quyết định' : 'Thêm quyết định tốt nghiệp'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						name='soQuyetDinh'
						label='Số Quyết Định'
						rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
					>
						<Input placeholder='VD: QĐ-2024-001' />
					</Form.Item>

					<Form.Item
						name='ngayBanHanh'
						label='Ngày Ban Hành'
						rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
					>
						<Input type='date' />
					</Form.Item>

					<Form.Item
						name='idSoVanBang'
						label='Sổ Văn Bằng'
						rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
					>
						<Select
							placeholder='Chọn sổ văn bằng'
							options={soVanBang.map((item) => ({
								label: `Sổ ${item.nam} - ${item.soHieuSo}`,
								value: item.id,
							}))}
						/>
					</Form.Item>

					<Form.Item name='trichYeu' label='Trích Yếu' rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}>
						<Input.TextArea placeholder='Nhập nội dung trích yếu...' rows={3} />
					</Form.Item>

					<Form.Item
						name='soLuongSinhVienTotNghiep'
						label='Số Lượng Sinh Viên Tốt Nghiệp'
						rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='trangThai'
						label='Trạng Thái'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
					>
						<Select
							options={[
								{ label: 'Nhập', value: 'nhap' },
								{ label: 'Hoạt động', value: 'hoat_dong' },
								{ label: 'Đã kết thúc', value: 'da_ket_thuc' },
							]}
						/>
					</Form.Item>

					<Form.Item name='ghiChu' label='Ghi Chú'>
						<Input.TextArea placeholder='Nhập ghi chú...' rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết quyết định'
				visible={isDetailDrawerVisible}
				onCancel={() => setIsDetailDrawerVisible(false)}
				width={600}
				footer={[
					<Button key='close' onClick={() => setIsDetailDrawerVisible(false)}>
						Đóng
					</Button>,
				]}
			>
				{selectedRecord && (
					<div>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<p>
									<strong>Số Quyết Định:</strong> {selectedRecord.soQuyetDinh}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Ngày Ban Hành:</strong>{' '}
									{moment(selectedRecord.ngayBanHanh, 'YYYY-MM-DD').format('DD/MM/YYYY')}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Sổ Văn Bằng:</strong> {getSoVanBangName(selectedRecord.idSoVanBang)}
								</p>
							</Col>
							<Col span={24}>
								<Divider />
							</Col>
							<Col span={24}>
								<strong>Trích Yếu:</strong>
								<p>{selectedRecord.trichYeu}</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Số Lượng SV Tốt Nghiệp:</strong> {selectedRecord.soLuongSinhVienTotNghiep}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Trạng Thái:</strong>{' '}
									<Tag
										color={
											selectedRecord.trangThai === 'hoat_dong'
												? 'green'
												: selectedRecord.trangThai === 'nhap'
												? 'blue'
												: 'red'
										}
									>
										{selectedRecord.trangThai === 'hoat_dong'
											? 'Hoạt động'
											: selectedRecord.trangThai === 'nhap'
											? 'Nhập'
											: 'Đã kết thúc'}
									</Tag>
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Ghi Chú:</strong> {selectedRecord.ghiChu || 'Không có'}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Ngày Tạo:</strong> {moment(selectedRecord.ngayTao).format('DD/MM/YYYY HH:mm')}
								</p>
							</Col>
						</Row>
					</div>
				)}
			</Modal>
		</Card>
	);
};

export default QuyetDinhTotNghiep;
