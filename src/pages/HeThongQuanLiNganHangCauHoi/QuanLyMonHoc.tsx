import { useModel } from 'umi';
import { useState } from 'react';
import { Table, Popconfirm, message, Button, Modal, Form, Input, InputNumber, Col, Row } from 'antd';
import type { MonHoc } from '@/models/quanlydethi';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const QuanLyMonHoc = () => {
	const { monHoc, themMonHoc, capNhatMonHoc, xoaMonHoc } = useModel('quanlydethi');
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<MonHoc | null>(null);
	const [form] = Form.useForm<Omit<MonHoc, 'id'>>();
	const [searchText, setSearchText] = useState('');

	const filteredData = monHoc.filter(
		(item: MonHoc) =>
			item.tenMonHoc.toLowerCase().includes(searchText.toLowerCase()) ||
			item.maMonHoc.toLowerCase().includes(searchText.toLowerCase()),
	);

	const handleAdd = () => {
		const values = form.getFieldsValue();
		const monMoi: MonHoc = {
			id: Date.now().toString(),
			...values,
		};
		themMonHoc(monMoi);
		message.success('Thêm môn học thành công');
		setIsOpen(false);
		form.resetFields();
	};

	const handleEdit = () => {
		if (!isEdit) return;
		const values = form.getFieldsValue();
		capNhatMonHoc(isEdit.id, values);
		message.success('Cập nhật môn học thành công');
		setIsEdit(null);
		setIsOpen(false);
		form.resetFields();
	};

	const onEdit = (record: MonHoc) => {
		setIsEdit(record);
		form.setFieldsValue({
			maMonHoc: record.maMonHoc,
			tenMonHoc: record.tenMonHoc,
			soTinChi: record.soTinChi,
		});
		setIsOpen(true);
	};

	const handleDelete = (id: string) => {
		xoaMonHoc(id);
		message.success('Xóa môn học thành công');
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
			title: 'Mã môn học',
			dataIndex: 'maMonHoc',
			key: 'maMonHoc',
			align: 'center' as const,
			sorter: (a: MonHoc, b: MonHoc) => a.maMonHoc.localeCompare(b.maMonHoc),
		},
		{
			title: 'Tên môn học',
			dataIndex: 'tenMonHoc',
			key: 'tenMonHoc',
			sorter: (a: MonHoc, b: MonHoc) => a.tenMonHoc.localeCompare(b.tenMonHoc),
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			key: 'soTinChi',
			align: 'center' as const,
			width: 120,
			sorter: (a: MonHoc, b: MonHoc) => a.soTinChi - b.soTinChi,
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			width: 120,
			render: (_: any, record: MonHoc) => (
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
			<h2>Quản Lý Môn Học</h2>
			<Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
						Thêm môn học
					</Button>
				</Col>
				<Col>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span style={{ whiteSpace: 'nowrap' }}>Tìm kiếm:</span>
						<Input
							placeholder='Nhập mã hoặc tên môn học...'
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
				title={isEdit ? 'Cập nhật môn học' : 'Thêm môn học'}
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
						label='Mã môn học'
						name='maMonHoc'
						rules={[{ required: true, message: 'Vui lòng nhập mã môn học!' }]}
					>
						<Input placeholder='VD: IT101' />
					</Form.Item>

					<Form.Item
						label='Tên môn học'
						name='tenMonHoc'
						rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
					>
						<Input placeholder='VD: Lập trình cơ bản' />
					</Form.Item>

					<Form.Item
						label='Số tín chỉ'
						name='soTinChi'
						rules={[
							{ required: true, message: 'Vui lòng nhập số tín chỉ!' },
							{ type: 'number', min: 1, max: 10, message: 'Số tín chỉ phải từ 1-10!' },
						]}
					>
						<InputNumber style={{ width: '100%' }} min={1} max={10} />
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

export default QuanLyMonHoc;
