import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { LichHeThong } from '@/models/quanlylichhen';
import useAppointmentSystem from '@/models/quanlylichhen';

const DichVu: React.FC = () => {
	const { dichVu, themDichVu, capNhatDichVu, xoaDichVu } = useAppointmentSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	const handleOpenModal = (service?: LichHeThong.DichVu) => {
		if (service) {
			setEditingId(service.id);
			form.setFieldsValue(service);
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
				capNhatDichVu(editingId, values);
			} else {
				themDichVu(values);
			}
			setIsModalVisible(false);
			form.resetFields();
		} catch (error) {
			message.error('Vui lòng kiểm tra dữ liệu');
		}
	};

	const columns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'ten',
			key: 'ten',
			align: 'center' as const,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			key: 'moTa',
			align: 'center' as const,
		},
		{
			title: 'Giá (₫)',
			dataIndex: 'gia',
			key: 'gia',
			render: (gia: number) => new Intl.NumberFormat('vi-VN').format(gia),
			align: 'center' as const,
		},
		{
			title: 'Thời gian (phút)',
			dataIndex: 'khoangThoiGian',
			key: 'khoangThoiGian',
			align: 'center' as const,
		},
		{
			title: 'Danh mục',
			dataIndex: 'danhMuc',
			key: 'danhMuc',
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: LichHeThong.DichVu) => (
				<Space size='small'>
					<Button size='small' type='primary' icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa dịch vụ?' okText='Có' cancelText='Không' onConfirm={() => xoaDichVu(record.id)}>
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
			<Card title='Quản lý dịch vụ'>
				<div style={{ marginBottom: '16px' }}>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
						Thêm dịch vụ
					</Button>
				</div>

				<Table dataSource={dichVu} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} scroll={{ x: true }} />
			</Card>

			<Modal
				title={editingId ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
				visible={isModalVisible}
				onOk={handleSave}
				onCancel={() => {
					setIsModalVisible(false);
					form.resetFields();
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Tên dịch vụ' name='ten' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Mô tả' name='moTa' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item label='Giá' name='gia' rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label='Thời gian (phút)' name='khoangThoiGian' rules={[{ required: true }]}>
						<InputNumber min={5} step={5} />
					</Form.Item>
					<Form.Item label='Danh mục' name='danhMuc' rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DichVu;
