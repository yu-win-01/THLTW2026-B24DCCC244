import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message, Tag } from 'antd';
import type { Post, Tag as TagInterface } from '@/models/ungdungblogcanhan';
import { loadPosts, loadTags, savePosts, generateId } from '@/models/ungdungblogcanhan';

const { Option } = Select;
const { TextArea } = Input;

const QuanLyBaiViet: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [tags, setTags] = useState<TagInterface[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		const loadedPosts = loadPosts();
		const loadedTags = loadTags();
		setPosts(loadedPosts);
		setTags(loadedTags);
		setFilteredPosts(loadedPosts);
	}, []);

	useEffect(() => {
		let filtered = posts;
		if (searchQuery) {
			filtered = filtered.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
		}
		if (statusFilter) {
			filtered = filtered.filter((post) => post.status === statusFilter);
		}
		setFilteredPosts(filtered);
	}, [posts, searchQuery, statusFilter]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		let filtered = posts;
		if (query) {
			filtered = filtered.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()));
		}
		if (statusFilter) {
			filtered = filtered.filter((post) => post.status === statusFilter);
		}
		setFilteredPosts(filtered);
	};

	const handleStatusFilter = (status: string) => {
		setStatusFilter(status);
		let filtered = posts;
		if (searchQuery) {
			filtered = filtered.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
		}
		if (status) {
			filtered = filtered.filter((post) => post.status === status);
		}
		setFilteredPosts(filtered);
	};

	const handleAdd = () => {
		setEditingPost(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleEdit = (post: Post) => {
		setEditingPost(post);
		form.setFieldsValue(post);
		setIsModalVisible(true);
	};

	const handleDelete = (postId: string) => {
		const newPosts = posts.filter((p) => p.id !== postId);
		savePosts(newPosts);
		setPosts(newPosts);
		message.success('Đã xóa bài viết');
	};

	const handleModalOk = () => {
		form.validateFields().then((values) => {
			const now = new Date().toISOString();
			if (editingPost) {
				const updatedPost: Post = {
					...editingPost,
					...values,
					updatedAt: now,
				};
				const newPosts = posts.map((p) => (p.id === editingPost.id ? updatedPost : p));
				savePosts(newPosts);
				setPosts(newPosts);
				setIsModalVisible(false);
				message.success('Đã cập nhật bài viết');
			} else {
				const newPost: Post = {
					...values,
					id: generateId(),
					views: 0,
					createdAt: now,
					updatedAt: now,
					author: 'Admin',
				};
				const newPosts = [...posts, newPost];
				savePosts(newPosts);
				setPosts(newPosts);
				setIsModalVisible(false);
				message.success('Đã thêm bài viết');
			}
			form.resetFields();
		});
	};

	const columns = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={status === 'published' ? 'green' : 'orange'}>{status === 'published' ? 'Đã đăng' : 'Nháp'}</Tag>
			),
			align: 'center' as const,
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			key: 'tags',
			render: (tagIds: string[]) =>
				tagIds
					.map((tagId) => {
						const tag = tags.find((t) => t.id === tagId);
						return tag ? tag.name : '';
					})
					.join(', '),
			align: 'center' as const,
		},
		{
			title: 'Lượt xem',
			dataIndex: 'views',
			key: 'views',
			align: 'center' as const,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: string) => new Date(date).toLocaleDateString(),
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, record: Post) => (
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
			<div style={{ marginBottom: 16 }}>
				<Input
					placeholder='Tìm kiếm theo tiêu đề'
					onChange={(e) => handleSearch(e.target.value)}
					style={{ width: 200, marginRight: 16 }}
				/>
				<Select placeholder='Lọc theo trạng thái' onChange={handleStatusFilter} style={{ width: 150 }} allowClear>
					<Option value='draft'>Nháp</Option>
					<Option value='published'>Đã đăng</Option>
				</Select>
				<Button type='primary' onClick={handleAdd} style={{ marginLeft: 16 }}>
					Thêm bài viết
				</Button>
			</div>
			<Table columns={columns} dataSource={filteredPosts} rowKey='id' />
			<Modal
				title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}
				visible={isModalVisible}
				onOk={handleModalOk}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='title' label='Tiêu đề' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='slug' label='Slug' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='content' label='Nội dung' rules={[{ required: true }]}>
						<TextArea rows={10} />
					</Form.Item>
					<Form.Item name='thumbnail' label='Ảnh đại diện (URL)' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='tags' label='Thẻ' rules={[{ required: true }]}>
						<Select mode='multiple' placeholder='Chọn thẻ'>
							{tags.map((tag) => (
								<Option key={tag.id} value={tag.id}>
									{tag.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='status' label='Trạng thái' rules={[{ required: true }]}>
						<Select>
							<Option value='draft'>Nháp</Option>
							<Option value='published'>Đã đăng</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyBaiViet;
