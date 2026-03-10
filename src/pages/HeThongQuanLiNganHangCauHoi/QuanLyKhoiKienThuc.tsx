import { useModel } from 'umi';
import { useState } from 'react';
import { Table, Popconfirm, message, Button, Modal, Form, Input, Col, Row } from 'antd';
import type { KhoiKienThuc } from '@/models/quanlydethi';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const QuanLyKhoiKienThuc = () => {
	const { khoiKienThuc, themKhoiKienThuc, capNhatKhoiKienThuc, xoaKhoiKienThuc } = useModel('quanlydethi');
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<KhoiKienThuc | null>(null);
	const [form] = Form.useForm<Omit<KhoiKienThuc, 'id'>>();
	const [searchText, setSearchText] = useState('');

	const filteredData = khoiKienThuc.filter((item: KhoiKienThuc) =>
		item.tenKhoi.toLowerCase().includes(searchText.toLowerCase()),
	);

	const handleAdd = () => {
		const values = form.getFieldsValue();
		const khoiMoi: KhoiKienThuc = {
			id: Date.now().toString(),
			...values,
		};
		themKhoiKienThuc(khoiMoi);
		message.success('Thêm khối kiến thức thành công');
		setIsOpen(false);
		form.resetFields();
	};

	const handleEdit = () => {
		if (!isEdit) return;
		const values = form.getFieldsValue();
		capNhatKhoiKienThuc(isEdit.id, values);
		message.success('Cập nhật khối kiến thức thành công');
		setIsEdit(null);
		setIsOpen(false);
		form.resetFields();
	};

	const onEdit = (record: KhoiKienThuc) => {
		setIsEdit(record);
		form.setFieldsValue({
			tenKhoi: record.tenKhoi,
			moTa: record.moTa,
		});
		setIsOpen(true);
	};

	const handleDelete = (id: string) => {
		xoaKhoiKienThuc(id);
		message.success('Xóa khối kiến thức thành công');
	};

	const columns = [
		{
			title: 'STT',
			dataIndex: 'stt',
			key: 'stt',
			align: 'center' as const,
			width: 80,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên khối kiến thức',
			dataIndex: 'tenKhoi',
			key: 'tenKhoi',
			sorter: (a: KhoiKienThuc, b: KhoiKienThuc) => a.tenKhoi.localeCompare(b.tenKhoi),
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			key: 'moTa',
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			width: 120,
			render: (_: any, record: KhoiKienThuc) => (
				<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
					<EditOutlined
						title='Sửa'
						style={{ fontSize: 16, color: '#1890ff', cursor: 'pointer' }}
						onClick={() => onEdit(record)}
					/>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<DeleteOutlined style={{ fontSize: 16, color: '#ff4d4f', cursor: 'pointer' }} title='Xóa' />
					</Popconfirm>
				</div>
			),
		},
	];

	return (
		<div>
			<h2>Quản Lý Khối Kiến Thức</h2>
			<Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
						Thêm khối kiến thức
					</Button>
				</Col>
				<Col>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span style={{ whiteSpace: 'nowrap' }}>Tìm kiếm:</span>
						<Input
							placeholder='Nhập tên khối...'
							style={{ width: 250 }}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</div>
				</Col>
			</Row>

			<Table dataSource={filteredData} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={isEdit ? 'Cập nhật khối kiến thức' : 'Thêm khối kiến thức'}
				visible={isOpen}
				onCancel={() => {
					setIsOpen(false);
					setIsEdit(null);
					form.resetFields();
				}}
				footer={null}
			>
				<Form form={form} layout='vertical' onFinish={isEdit ? handleEdit : handleAdd}>
					<Form.Item
						label='Tên khối kiến thức'
						name='tenKhoi'
						rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức!' }]}
					>
						<Input placeholder='VD: Tổng quan, Chuyên sâu...' />
					</Form.Item>

					<Form.Item label='Mô tả' name='moTa'>
						<Input.TextArea rows={3} placeholder='Mô tả về khối kiến thức...' />
					</Form.Item>

					<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
						<Button
							onClick={() => {
								setIsOpen(false);
								setIsEdit(null);
								form.resetFields();
							}}
						>
							Hủy
						</Button>
						<Button type='primary' htmlType='submit'>
							{isEdit ? 'Cập nhật' : 'Thêm'}
						</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyKhoiKienThuc;
