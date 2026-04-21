import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, message } from 'antd';
import type { Tag } from '@/models/ungdungblogcanhan';
import { loadTags, saveTags, loadPosts, updateTagPostCounts, generateId } from '@/models/ungdungblogcanhan';

const QuanLyThe: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTag, setEditingTag] = useState<Tag | null>(null);
	const [form] = Form.useForm();

	const loadTagData = () => {
		const posts = loadPosts();
		const loadedTags = loadTags();
		const updatedTags = updateTagPostCounts(posts, loadedTags);
		setTags(updatedTags);
		saveTags(updatedTags);
	};

	useEffect(() => {
		loadTagData();
	}, []);

	const handleAdd = () => {
		setEditingTag(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (tag: Tag) => {
		setEditingTag(tag);
		form.setFieldsValue({ name: tag.name });
		setIsModalVisible(true);
	};

	const handleDelete = (tagId: string) => {
		const newTags = tags.filter((t) => t.id !== tagId);
		saveTags(newTags);
		setTags(newTags);
		message.success('Đã xóa thẻ');
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			if (editingTag) {
				const updatedTag: Tag = {
					...editingTag,
					name: values.name,
				};
				const newTags = tags.map((t) => (t.id === editingTag.id ? updatedTag : t));
				saveTags(newTags);
				setTags(newTags);
				message.success('Đã cập nhật thẻ');
			} else {
				const newTag: Tag = {
					id: generateId(),
					name: values.name,
					postCount: 0,
				};
				const newTags = [...tags, newTag];
				saveTags(newTags);
				setTags(newTags);
				message.success('Đã thêm thẻ');
			}
			setIsModalVisible(false);
		});
	};

	const columns = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			key: 'name',
			align: 'center' as const,
		},
		{
			title: 'Số bài viết',
			dataIndex: 'postCount',
			key: 'postCount',
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: Tag) => (
				<>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm title='Bạn có chắc muốn xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</>
			),
			align: 'center' as const,
		},
	];

	return (
		<div>
			<Button type='primary' onClick={handleAdd} style={{ marginBottom: 16 }}>
				Thêm thẻ
			</Button>
			<Table columns={columns} dataSource={tags} rowKey='id' />
			<Modal
				title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên thẻ' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyThe;
