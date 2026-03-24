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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { QuanLyVanBang } from '@/models/quanlyvanbang';
import useDocumentManagementSystem from '@/models/quanlyvanbang';

const SoVanBang: React.FC = () => {
	const { soVanBang, themSoVanBang, capNhatSoVanBang, xoaSoVanBang } = useDocumentManagementSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<QuanLyVanBang.SoVanBang | null>(null);
	const [form] = Form.useForm();

	const handleOpenModal = (record?: QuanLyVanBang.SoVanBang) => {
		if (record) {
			setEditingId(record.id);
			form.setFieldsValue({
				nam: record.nam,
				soHieuSo: record.soHieuSo,
				ngayMo: moment(record.ngayMo),
				soLuongConLai: record.soLuongConLai,
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
				const success = capNhatSoVanBang(editingId, {
					...values,
					ngayMo: values.ngayMo?.valueOf() || Date.now(),
				});

				if (success) {
					message.success('Cập nhật sổ văn bằng thành công');
					setIsModalVisible(false);
				} else {
					message.error('Cập nhật sổ văn bằng thất bại');
				}
			} else {
				const success = themSoVanBang({
					...values,
					ngayMo: values.ngayMo?.valueOf() || Date.now(),
					soLuongVanBang: 0,
				});

				if (success) {
					message.success('Thêm sổ văn bằng thành công');
					setIsModalVisible(false);
				} else {
					message.error('Thêm sổ văn bằng thất bại');
				}
			}
		} catch (error) {
			message.error('Vui lòng kiểm tra lại thông tin');
		}
	};

	const handleDelete = (id: string) => {
		if (xoaSoVanBang(id)) {
			message.success('Xóa sổ văn bằng thành công');
		} else {
			message.error('Xóa sổ văn bằng thất bại');
		}
	};

	const handleViewDetail = (record: QuanLyVanBang.SoVanBang) => {
		setSelectedRecord(record);
		setIsDetailDrawerVisible(true);
	};

	const columns = [
		{
			title: 'Năm',
			dataIndex: 'nam',
			key: 'nam',
			sorter: (a: any, b: any) => b.nam - a.nam,
			align: 'center' as const,
		},
		{
			title: 'Số hiệu sổ',
			dataIndex: 'soHieuSo',
			key: 'soHieuSo',
			align: 'center' as const,
		},
		{
			title: 'Ngày mở',
			dataIndex: 'ngayMo',
			key: 'ngayMo',
			render: (text: number) => moment(text).format('DD/MM/YYYY'),
			align: 'center' as const,
		},
		{
			title: 'Số lượng văn bằng',
			dataIndex: 'soLuongVanBang',
			key: 'soLuongVanBang',
			align: 'center' as const,
		},
		{
			title: 'Số lượng còn lại',
			dataIndex: 'soLuongConLai',
			key: 'soLuongConLai',
			align: 'center' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (text: string) => {
				const statusMap: Record<string, { color: string; label: string }> = {
					dang_su_dung: { color: 'green', label: 'Đang sử dụng' },
					da_dong: { color: 'red', label: 'Đã đóng' },
				};
				return <Tag color={statusMap[text]?.color}>{statusMap[text]?.label}</Tag>;
			},
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: QuanLyVanBang.SoVanBang) => (
				<Space size='middle'>
					<Button type='text' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} title='Xem chi tiết' />
					<Button type='text' icon={<EditOutlined />} onClick={() => handleOpenModal(record)} title='Chỉnh sửa' />
					<Popconfirm title='Xóa sổ văn bằng' onConfirm={() => handleDelete(record.id)} okText='Có' cancelText='Không'>
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
					<h2>Quản lý Sổ Văn Bằng</h2>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm sổ văn bằng
					</Button>
				</Col>
			</Row>

			<Table
				columns={columns as any}
				dataSource={soVanBang}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1200 }}
			/>

			<Modal
				title={editingId ? 'Chỉnh sửa sổ văn bằng' : 'Thêm sổ văn bằng'}
				visible={isModalVisible}
				onOk={handleSubmit}
				onCancel={() => setIsModalVisible(false)}
				width={600}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='nam' label='Năm' rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
						<InputNumber min={2000} max={2100} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='soHieuSo'
						label='Số hiệu sổ'
						rules={[{ required: true, message: 'Vui lòng nhập số hiệu sổ' }]}
					>
						<Input placeholder='VD: SV-2024-001' />
					</Form.Item>

					<Form.Item name='ngayMo' label='Ngày mở' rules={[{ required: true, message: 'Vui lòng chọn ngày mở' }]}>
						<Input type='date' />
					</Form.Item>

					<Form.Item
						name='soLuongConLai'
						label='Số lượng còn lại'
						rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name='trangThai'
						label='Trạng thái'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
					>
						<Select
							options={[
								{ label: 'Đang sử dụng', value: 'dang_su_dung' },
								{ label: 'Đã đóng', value: 'da_dong' },
							]}
						/>
					</Form.Item>

					<Form.Item name='ghiChu' label='Ghi chú'>
						<Input.TextArea placeholder='Nhập ghi chú...' rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Chi tiết sổ văn bằng'
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
									<strong>Năm:</strong> {selectedRecord.nam}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Số hiệu sổ:</strong> {selectedRecord.soHieuSo}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Ngày mở:</strong> {moment(selectedRecord.ngayMo).format('DD/MM/YYYY')}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Số lượng văn bằng:</strong> {selectedRecord.soLuongVanBang}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Số lượng còn lại:</strong> {selectedRecord.soLuongConLai}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Trạng thái:</strong>{' '}
									<Tag color={selectedRecord.trangThai === 'dang_su_dung' ? 'green' : 'red'}>
										{selectedRecord.trangThai === 'dang_su_dung' ? 'Đang sử dụng' : 'Đã đóng'}
									</Tag>
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Ghi chú:</strong> {selectedRecord.ghiChu || 'Không có'}
								</p>
							</Col>
							<Col span={24}>
								<p>
									<strong>Ngày tạo:</strong> {moment(selectedRecord.ngayTao).format('DD/MM/YYYY HH:mm')}
								</p>
							</Col>
						</Row>
					</div>
				)}
			</Modal>
		</Card>
	);
};

export default SoVanBang;
