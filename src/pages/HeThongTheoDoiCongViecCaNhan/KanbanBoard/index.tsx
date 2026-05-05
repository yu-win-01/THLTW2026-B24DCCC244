import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, DatePicker, Select, Space, Tag, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { Task, Tag as TaskTag } from '@/models/todolist';

const { Option } = Select;

interface DuLieuBieuMauTask {
	title: string;
	description: string;
	deadline: dayjs.Dayjs;
	priority: Task['priority'];
	tags: string[];
	status: Task['status'];
}

const KanbanBoard: React.FC = () => {
	const { tasks, tags, themTask, capNhatTask, xoaTask, getTagById } = useModel('todolist');
	const [moDrawer, setMoDrawer] = useState(false);
	const [taskDangSua, setTaskDangSua] = useState<Task | null>(null);
	const [bieuMau] = Form.useForm();

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
				tags: duLieuBieuMau.tags,
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

	const xuLyDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		if (!destination) return;

		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		const statusMap = {
			'can-lam': 'Cần làm',
			'dang-lam': 'Đang làm',
			'hoan-thanh': 'Hoàn thành',
		} as const;

		const newStatus = statusMap[destination.droppableId as keyof typeof statusMap];

		if (newStatus) {
			capNhatTask(draggableId, { status: newStatus });
		}
	};

	const renderTaskCard = (task: Task, index: number) => (
		<Draggable key={task.id} draggableId={task.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{ marginBottom: 8, ...provided.draggableProps.style }}
				>
					<Card
						size='small'
						title={task.title}
						extra={
							<Space>
								<Button type='link' icon={<EditOutlined />} onClick={() => moDrawerSua(task)} />
								<Popconfirm
									title='Bạn có chắc muốn xóa task này?'
									onConfirm={() => xuLyXoa(task.id)}
									okText='Có'
									cancelText='Không'
								>
									<Button type='link' danger icon={<DeleteOutlined />} />
								</Popconfirm>
							</Space>
						}
					>
						<p>{task.description}</p>
						<p>
							<strong>Deadline:</strong> {dayjs(task.deadline).format('DD/MM/YYYY')}
						</p>
						<p>
							<strong>Ưu tiên:</strong>{' '}
							<Tag color={task.priority === 'Cao' ? 'red' : task.priority === 'Trung bình' ? 'orange' : 'green'}>
								{task.priority}
							</Tag>
						</p>
						<p>
							<strong>Tags:</strong>{' '}
							{(task.tags || []).map((tagId) => {
								const tag = getTagById(tagId);
								return tag ? <Tag key={tagId}>{tag.name}</Tag> : null;
							})}
						</p>
					</Card>
				</div>
			)}
		</Draggable>
	);

	const cotKanban = [
		{ id: 'can-lam', title: 'Cần làm', status: 'Cần làm' },
		{ id: 'dang-lam', title: 'Đang làm', status: 'Đang làm' },
		{ id: 'hoan-thanh', title: 'Hoàn thành', status: 'Hoàn thành' },
	];

	return (
		<div>
			<Button type='primary' icon={<PlusOutlined />} onClick={() => moDrawerSua()} style={{ marginBottom: 16 }}>
				Thêm Task
			</Button>

			<DragDropContext onDragEnd={xuLyDragEnd}>
				<Row gutter={16}>
					{cotKanban.map((cot) => (
						<Col span={8} key={cot.id}>
							<Card title={cot.title}>
								<Droppable droppableId={cot.id}>
									{(provided) => (
										<div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 400 }}>
											{tasks
												.filter((task) => task.status === cot.status)
												.map((task, index) => renderTaskCard(task, index))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</Card>
						</Col>
					))}
				</Row>
			</DragDropContext>

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
					{!taskDangSua && (
						<Form.Item name='status' label='Trạng thái' initialValue='Cần làm'>
							<Select>
								<Option value='Cần làm'>Cần làm</Option>
								<Option value='Đang làm'>Đang làm</Option>
								<Option value='Hoàn thành'>Hoàn thành</Option>
							</Select>
						</Form.Item>
					)}
				</Form>
			</Modal>
		</div>
	);
};

export default KanbanBoard;
