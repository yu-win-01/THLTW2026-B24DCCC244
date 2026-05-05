import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Space, Tag, Popconfirm, Input as AntInput } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { Task, Tag as TaskTag } from '@/models/todolist';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface DuLieuBieuMauTask {
	title: string;
	description: string;
	deadline: dayjs.Dayjs;
	priority: Task['priority'];
	tags: string[];
	status: Task['status'];
}

const DanhSachTasks: React.FC = () => {
	const { tasks, tags, themTask, capNhatTask, xoaTask, getTagById } = useModel('todolist');
	const [moDrawer, setMoDrawer] = useState(false);
	const [taskDangSua, setTaskDangSua] = useState<Task | null>(null);
	const [bieuMau] = Form.useForm();
	const [timKiem, setTimKiem] = useState('');
	const [locTrangThai, setLocTrangThai] = useState<string>('');

	const moDrawerSua = (task?: Task) => {
		try {
			setTaskDangSua(task || null);
			if (task) {
				bieuMau.setFieldsValue({
					title: task.title,
					description: task.description,
					deadline: dayjs(task.deadline),
					priority: task.priority,
					tags: task.tags,
					status: task.status,
				});
			} else {
				bieuMau.resetFields();
			}
			setMoDrawer(true);
		} catch (error) {
			console.error('Lỗi khi mở modal:', error);
		}
	};

	const xuLyDongDrawer = () => {
		setMoDrawer(false);
		setTaskDangSua(null);
		bieuMau.resetFields();
	};

	const xuLyGui = async () => {
		try {
			const giaTri = await bieuMau.validateFields();
			const duLieuBieuMau: DuLieuBieuMauTask = giaTri;

			const duLieuTask = {
				title: duLieuBieuMau.title,
				description: duLieuBieuMau.description,
				deadline: duLieuBieuMau.deadline.toISOString(),
				priority: duLieuBieuMau.priority,
				tags: duLieuBieuMau.tags || [],
				status: duLieuBieuMau.status,
			};

			if (taskDangSua) {
				capNhatTask(taskDangSua.id, duLieuTask);
			} else {
				themTask(duLieuTask);
			}

			xuLyDongDrawer();
		} catch (loi) {
			console.error('Xác thực thất bại:', loi);
		}
	};

	const xuLyXoa = (id: string) => {
		xoaTask(id);
	};

	const tasksDaLoc = useMemo(() => {
		let filtered = tasks;

		if (timKiem) {
			filtered = filtered.filter(
				(task) =>
					task.title.toLowerCase().includes(timKiem.toLowerCase()) ||
					task.description.toLowerCase().includes(timKiem.toLowerCase()),
			);
		}

		if (locTrangThai) {
			filtered = filtered.filter((task) => task.status === locTrangThai);
		}

		return filtered;
	}, [tasks, timKiem, locTrangThai]);

	const cotBang: ColumnsType<Task> = [
		{
			title: 'Tên task',
			dataIndex: 'title',
			key: 'title',
			sorter: (a, b) => a.title.localeCompare(b.title),
			align: 'center' as const,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			align: 'center' as const,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			render: (deadline: string) => dayjs(deadline).format('DD/MM/YYYY'),
			sorter: (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
			align: 'center' as const,
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			key: 'priority',
			render: (priority: Task['priority']) => (
				<Tag color={priority === 'Cao' ? 'red' : priority === 'Trung bình' ? 'orange' : 'green'}>{priority}</Tag>
			),
			filters: [
				{ text: 'Cao', value: 'Cao' },
				{ text: 'Trung bình', value: 'Trung bình' },
				{ text: 'Thấp', value: 'Thấp' },
			],
			onFilter: (value, record) => record.priority === value,
			align: 'center' as const,
		},
		{
			title: 'Tags',
			dataIndex: 'tags',
			key: 'tags',
			render: (tagIds: string[]) =>
				(tagIds || []).map((tagId) => {
					const tag = getTagById(tagId);
					return tag ? <Tag key={tagId}>{tag.name}</Tag> : null;
				}),
			align: 'center' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			filters: [
				{ text: 'Cần làm', value: 'Cần làm' },
				{ text: 'Đang làm', value: 'Đang làm' },
				{ text: 'Hoàn thành', value: 'Hoàn thành' },
			],
			onFilter: (value, record) => record.status === value,
			align: 'center' as const,
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Button type='link' icon={<EditOutlined />} onClick={() => moDrawerSua(record)} />
					<Popconfirm
						title='Bạn có chắc muốn xóa task này?'
						onConfirm={() => xuLyXoa(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
			align: 'center' as const,
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => moDrawerSua()}>
					Thêm Task
				</Button>
				<Space>
					<AntInput
						placeholder='Tìm kiếm theo tên hoặc mô tả'
						prefix={<SearchOutlined />}
						value={timKiem}
						onChange={(e) => setTimKiem(e.target.value)}
						style={{ width: 300 }}
					/>
					<Select
						placeholder='Lọc theo trạng thái'
						value={locTrangThai}
						onChange={(value) => setLocTrangThai(value)}
						style={{ width: 150 }}
						allowClear
					>
						<Option value='Cần làm'>Cần làm</Option>
						<Option value='Đang làm'>Đang làm</Option>
						<Option value='Hoàn thành'>Hoàn thành</Option>
					</Select>
				</Space>
			</Space>

			<Table columns={cotBang} dataSource={tasksDaLoc} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={taskDangSua ? 'Sửa Task' : 'Thêm Task'}
				visible={moDrawer}
				onCancel={xuLyDongDrawer}
				footer={[
					<Button key='cancel' onClick={xuLyDongDrawer}>
						Hủy
					</Button>,
					<Button key='submit' type='primary' onClick={xuLyGui}>
						Lưu
					</Button>,
				]}
			>
				<Form form={bieuMau} layout='vertical'>
					<Form.Item name='title' label='Tên task' rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item name='deadline' label='Deadline' rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name='priority'
						label='Mức độ ưu tiên'
						rules={[{ required: true, message: 'Vui lòng chọn ưu tiên!' }]}
					>
						<Select placeholder='Chọn ưu tiên'>
							<Option value='Cao'>Cao</Option>
							<Option value='Trung bình'>Trung bình</Option>
							<Option value='Thấp'>Thấp</Option>
						</Select>
					</Form.Item>
					<Form.Item name='tags' label='Tags'>
						<Select mode='multiple' placeholder='Chọn tags'>
							{tags.map((tag) => (
								<Option key={tag.id} value={tag.id}>
									{tag.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='status'
						label='Trạng thái'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
					>
						<Select placeholder='Chọn trạng thái'>
							<Option value='Cần làm'>Cần làm</Option>
							<Option value='Đang làm'>Đang làm</Option>
							<Option value='Hoàn thành'>Hoàn thành</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DanhSachTasks;
