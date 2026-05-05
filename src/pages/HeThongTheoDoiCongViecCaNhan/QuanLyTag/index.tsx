import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Tag as TaskTag } from '@/models/todolist';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';

const QuanLyTag: React.FC = () => {
	const { tags, themTag, capNhatTag, xoaTag } = useModel('todolist');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTag, setEditingTag] = useState<TaskTag | null>(null);
	const [form] = Form.useForm();

	const handleAdd = () => {
		setEditingTag(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (tag: TaskTag) => {
		setEditingTag(tag);
		form.setFieldsValue({ name: tag.name });
		setIsModalVisible(true);
	};

	const handleDelete = (tagId: string) => {
		xoaTag(tagId);
		message.success('Đã xóa tag');
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			if (editingTag) {
				capNhatTag(editingTag.id, { name: values.name });
				message.success('Đã cập nhật tag');
			} else {
				themTag({ name: values.name });
				message.success('Đã thêm tag');
			}
			setIsModalVisible(false);
			form.resetFields();
		});
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	const columns: ColumnsType<TaskTag> = [
		{
			title: 'Tên tag',
			dataIndex: 'name',
			key: 'name',
			align: 'center' as const,
		},
		{
			title: 'Số task',
			dataIndex: 'taskCount',
			key: 'taskCount',
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm
						title='Bạn có chắc muốn xóa tag này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
			align: 'center' as const,
		},
	];

	return (
		<div>
			<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
				Thêm Tag
			</Button>
			<Table columns={columns} dataSource={tags} rowKey='id' />
			<Modal
				title={editingTag ? 'Sửa Tag' : 'Thêm Tag'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên tag' rules={[{ required: true, message: 'Vui lòng nhập tên tag!' }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyTag;
