import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Timeline } from 'antd';
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	OrderedListOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';

const Dashboard: React.FC = () => {
	const { getTotalTasks, getCompletedTasks, getOverdueTasks, tasks } = useModel('todolist');

	const tongTasks = useMemo(() => getTotalTasks(), [getTotalTasks]);
	const soTasksHoanThanh = useMemo(() => getCompletedTasks().length, [getCompletedTasks]);
	const soTasksQuaHan = useMemo(() => getOverdueTasks().length, [getOverdueTasks]);

	const cacTasksGanNhat = useMemo(() => {
		return tasks
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
			.slice(0, 5)
			.map((task) => ({
				id: task.id,
				title: task.title,
				deadline: new Date(task.deadline).toLocaleDateString(),
				priority: task.priority,
				status: task.status,
				updatedAt: new Date(task.updatedAt).toLocaleDateString(),
			}));
	}, [tasks]);

	return (
		<div>
			<Row gutter={16} style={{ marginBottom: 24 }}>
				<Col span={6}>
					<Card>
						<Statistic
							title='Tổng số tasks'
							value={tongTasks}
							prefix={<OrderedListOutlined />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Tasks hoàn thành'
							value={soTasksHoanThanh}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Tasks quá hạn'
							value={soTasksQuaHan}
							prefix={<ExclamationCircleOutlined />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Tasks đang làm'
							value={tasks.filter((t) => t.status === 'Đang làm').length}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Tasks gần nhất'>
				<Timeline>
					{cacTasksGanNhat.map((task) => (
						<Timeline.Item
							key={task.id}
							color={task.status === 'Hoàn thành' ? 'green' : task.status === 'Đang làm' ? 'blue' : 'red'}
						>
							<p>
								<strong>{task.title}</strong>
							</p>
							<p>Deadline: {task.deadline}</p>
							<p>Ưu tiên: {task.priority}</p>
							<p>Trạng thái: {task.status}</p>
							<p>Cập nhật: {task.updatedAt}</p>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</div>
	);
};

export default Dashboard;
