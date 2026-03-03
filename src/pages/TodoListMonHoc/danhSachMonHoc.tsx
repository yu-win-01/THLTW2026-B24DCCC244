import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { monhoc } from '@/models/monhoc';
import { useMonHocModel } from '@/models/monhoc';

const DanhSachMonHoc = () => {
	const { monHoc, themMonHoc, suaMonHoc, xoaMonHoc } = useMonHocModel();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [editingRecord, setEditingRecord] = useState<monhoc | null>(null);
	const [form] = Form.useForm();

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleEdit = (record: monhoc) => {
		setEditingRecord(record);
		form.setFieldsValue({
			tenMonHoc: record.tenMonHoc,
		});
		setIsModalOpen(true);
	};

	const handleDelete = (id: number) => {
		xoaMonHoc(id);
		message.success('Xóa môn học thành công');
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			if (editingRecord) {
				suaMonHoc(editingRecord.id, values.tenMonHoc);
				message.success('Cập nhật môn học thành công');
			} else {
				themMonHoc(values.tenMonHoc);
				message.success('Thêm môn học thành công');
			}
			setIsModalOpen(false);
			form.resetFields();
			setEditingRecord(null);
		});
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
			title: 'Tên môn học',
			dataIndex: 'tenMonHoc',
			key: 'tenMonHoc',
			align: 'left' as const,
			sorter: (a: monhoc, b: monhoc) => a.tenMonHoc.localeCompare(b.tenMonHoc),
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			width: 120,
			render: (_: any, record: monhoc) => {
				return (
					<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
						<EditOutlined
							title='Sửa'
							style={{ fontSize: 16, color: '#1890ff', cursor: 'pointer' }}
							onClick={() => handleEdit(record)}
						/>
						<Popconfirm
							title='Bạn có chắc muốn xóa môn học này?'
							onConfirm={() => handleDelete(record.id)}
							okText='Có'
							cancelText='Không'
						>
							<DeleteOutlined title='Xóa' style={{ fontSize: 16, color: '#ff4d4f', cursor: 'pointer' }} />
						</Popconfirm>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h3>Danh sách môn học</h3>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm môn học
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={monHoc}
				rowKey='id'
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Tổng số: ${total} môn học`,
				}}
				bordered
			/>

			<Modal
				title={editingRecord ? 'Sửa môn học' : 'Thêm môn học mới'}
				visible={isModalOpen}
				onOk={handleSubmit}
				onCancel={() => {
					setIsModalOpen(false);
					form.resetFields();
					setEditingRecord(null);
				}}
				okText={editingRecord ? 'Cập nhật' : 'Thêm'}
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Tên môn học'
						name='tenMonHoc'
						rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
					>
						<Input placeholder='Nhập tên môn học' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DanhSachMonHoc;
