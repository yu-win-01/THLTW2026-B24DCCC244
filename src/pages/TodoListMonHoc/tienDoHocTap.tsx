import { useState, useMemo } from 'react';
import {
	Card,
	Table,
	Button,
	Modal,
	Form,
	InputNumber,
	Input,
	message,
	Popconfirm,
	Tag,
	Progress,
	Row,
	Col,
	Statistic,
	DatePicker,
	Radio,
	Collapse,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	PlusOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
} from '@ant-design/icons';
import type { tientrinhmonhoc } from '@/models/tientrinhhoctap';
import { useTienTrinhMonHocModel } from '@/models/tientrinhhoctap';
import { useMucTieuMonHocModel } from '@/models/muctieumonhoc';
import moment from 'moment';

interface TienDoHocTapProps {
	subjectId: number;
	subjectName: string;
}

const TienDoHocTap: React.FC<TienDoHocTapProps> = ({ subjectId, subjectName }) => {
	const { tienTrinhMonHoc, themTienTrinhMonHoc, capNhatTrangThai, suaTienTrinhMonHoc, xoaTienTrinhMonHoc } =
		useTienTrinhMonHocModel();
	const { mucTieuMonHoc, themMucTieuMonHoc, suaMucTieuMonHoc, xoaMucTieuMonHoc } = useMucTieuMonHocModel();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isMucTieuModalOpen, setIsMucTieuModalOpen] = useState<boolean>(false);
	const [editingRecord, setEditingRecord] = useState<tientrinhmonhoc | null>(null);
	const [editingMucTieu, setEditingMucTieu] = useState<any>(null);
	const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
	const [form] = Form.useForm();
	const [mucTieuForm] = Form.useForm();

	const filteredTienTrinh = tienTrinhMonHoc.filter((item) => item.subjectId === subjectId);
	const mucTieu = mucTieuMonHoc.find((item) => item.subjectId === subjectId);

	const thongKe = useMemo(() => {
		const tongThoiGian = filteredTienTrinh.reduce((sum, item) => sum + item.thoiLuongHoc, 0);
		const soLuongHoanThanh = filteredTienTrinh.filter((item) => item.hoanThanh).length;
		const tongSoBaiHoc = filteredTienTrinh.length;
		const tiLe = mucTieu && mucTieu.muctieu > 0 ? (tongThoiGian / mucTieu.muctieu) * 100 : 0;

		return {
			tongThoiGian,
			soLuongHoanThanh,
			tongSoBaiHoc,
			tiLe: Math.min(tiLe, 100),
			mucTieuGio: mucTieu?.muctieu || 0,
		};
	}, [filteredTienTrinh, mucTieu]);
	const thongKeTheoKhoangThoiGian = useMemo(() => {
		const groupedData: Record<string, { tongGio: number; soLuong: number; chiTiet: tientrinhmonhoc[] }> = {};

		filteredTienTrinh.forEach((item) => {
			const ngay = item.ngayhoc ? new Date(item.ngayhoc) : new Date(item.Datetime);
			let key: string;

			if (viewMode === 'day') {
				key = moment(ngay).format('DD/MM/YYYY');
			} else {
				key = moment(ngay).format('MM/YYYY');
			}

			if (!groupedData[key]) {
				groupedData[key] = { tongGio: 0, soLuong: 0, chiTiet: [] };
			}

			groupedData[key].tongGio += item.thoiLuongHoc;
			groupedData[key].soLuong += 1;
			groupedData[key].chiTiet.push(item);
		});

		const result = Object.entries(groupedData)
			.map(([key, value]) => ({
				key,
				...value,
			}))
			.sort((a, b) => {
				if (viewMode === 'day') {
					return moment(a.key, 'DD/MM/YYYY').valueOf() - moment(b.key, 'DD/MM/YYYY').valueOf();
				} else {
					return moment(a.key, 'MM/YYYY').valueOf() - moment(b.key, 'MM/YYYY').valueOf();
				}
			});

		let tongConDon = 0;
		result.forEach((item) => {
			tongConDon += item.tongGio;
			(item as any).tongCongDon = tongConDon;
		});

		return result;
	}, [filteredTienTrinh, viewMode]);

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleEdit = (record: tientrinhmonhoc) => {
		setEditingRecord(record);
		form.setFieldsValue({
			thoiLuongHoc: record.thoiLuongHoc,
			noiDungDaHoc: record.noiDungDaHoc,
			ghiChu: record.ghiChu,
			ngayhoc: record.ngayhoc ? moment(record.ngayhoc) : null,
		});
		setIsModalOpen(true);
	};

	const handleDelete = (id: number) => {
		xoaTienTrinhMonHoc(id);
		message.success('Xóa tiến trình thành công');
	};

	const handleSubmit = () => {
		form.validateFields().then((values) => {
			const ngayhoc = values.ngayhoc ? values.ngayhoc.toDate() : new Date();
			if (editingRecord) {
				suaTienTrinhMonHoc(editingRecord.id, values.thoiLuongHoc, values.noiDungDaHoc, values.ghiChu, ngayhoc);
				message.success('Cập nhật tiến trình thành công');
			} else {
				themTienTrinhMonHoc(subjectId, values.thoiLuongHoc, values.noiDungDaHoc, values.ghiChu, ngayhoc);
				message.success('Thêm tiến trình thành công');
			}
			setIsModalOpen(false);
			form.resetFields();
			setEditingRecord(null);
		});
	};

	const handleToggleStatus = (record: tientrinhmonhoc) => {
		capNhatTrangThai(record.id, !record.hoanThanh);
		message.success(`Đã ${!record.hoanThanh ? 'hoàn thành' : 'bỏ hoàn thành'} bài học`);
	};

	const handleAddMucTieu = () => {
		if (mucTieu) {
			setEditingMucTieu(mucTieu);
			mucTieuForm.setFieldsValue({ muctieu: mucTieu.muctieu });
		} else {
			setEditingMucTieu(null);
			mucTieuForm.resetFields();
		}
		setIsMucTieuModalOpen(true);
	};

	const handleSubmitMucTieu = () => {
		mucTieuForm.validateFields().then((values) => {
			if (editingMucTieu) {
				suaMucTieuMonHoc(editingMucTieu.id, values.muctieu);
				message.success('Cập nhật mục tiêu thành công');
			} else {
				themMucTieuMonHoc(subjectId, values.muctieu);
				message.success('Thêm mục tiêu thành công');
			}
			setIsMucTieuModalOpen(false);
			mucTieuForm.resetFields();
			setEditingMucTieu(null);
		});
	};

	const handleDeleteMucTieu = () => {
		if (mucTieu) {
			xoaMucTieuMonHoc(mucTieu.id);
			message.success('Xóa mục tiêu thành công');
		}
	};

	const columns = [
		{
			title: 'STT',
			dataIndex: 'stt',
			key: 'stt',
			align: 'center' as const,
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Ngày học',
			dataIndex: 'ngayhoc',
			key: 'ngayhoc',
			align: 'center' as const,
			width: 150,
			sorter: (a: tientrinhmonhoc, b: tientrinhmonhoc) => {
				const dateA = a.ngayhoc ? new Date(a.ngayhoc).getTime() : new Date(a.Datetime).getTime();
				const dateB = b.ngayhoc ? new Date(b.ngayhoc).getTime() : new Date(b.Datetime).getTime();
				return dateA - dateB;
			},
			render: (_: any, record: tientrinhmonhoc) => {
				const date = record.ngayhoc ? record.ngayhoc : record.Datetime;
				return moment(date).format('DD/MM/YYYY');
			},
		},
		{
			title: 'Thời lượng học (giờ)',
			dataIndex: 'thoiLuongHoc',
			key: 'thoiLuongHoc',
			align: 'center' as const,
			width: 150,
			sorter: (a: tientrinhmonhoc, b: tientrinhmonhoc) => a.thoiLuongHoc - b.thoiLuongHoc,
		},
		{
			title: 'Nội dung đã học',
			dataIndex: 'noiDungDaHoc',
			key: 'noiDungDaHoc',
			align: 'left' as const,
			ellipsis: true,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			key: 'ghiChu',
			align: 'left' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'hoanThanh',
			key: 'hoanThanh',
			align: 'center' as const,
			width: 150,
			render: (hoanThanh: boolean, record: tientrinhmonhoc) => (
				<Tag
					color={hoanThanh ? 'green' : 'orange'}
					style={{ cursor: 'pointer' }}
					onClick={() => handleToggleStatus(record)}
				>
					{hoanThanh ? <CheckCircleOutlined /> : <ClockCircleOutlined />} {hoanThanh ? 'Hoàn thành' : 'Chưa hoàn thành'}
				</Tag>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			width: 120,
			render: (_: any, record: tientrinhmonhoc) => {
				return (
					<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
						<EditOutlined
							title='Sửa'
							style={{ fontSize: 16, color: '#1890ff', cursor: 'pointer' }}
							onClick={() => handleEdit(record)}
						/>
						<Popconfirm
							title='Bạn có chắc muốn xóa tiến trình này?'
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
			<h3 style={{ marginBottom: 16 }}>Tiến độ học tập: {subjectName}</h3>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Tổng thời gian học (giờ)'
							value={thongKe.tongThoiGian}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Số bài đã hoàn thành'
							value={thongKe.soLuongHoanThanh}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic title='Tổng số bài học' value={thongKe.tongSoBaiHoc} valueStyle={{ color: '#722ed1' }} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Mục tiêu (giờ)'
							value={thongKe.mucTieuGio || 'Chưa đặt'}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Mục tiêu học tập' style={{ marginBottom: 24 }}>
				<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div>
						{mucTieu ? (
							<>
								<span style={{ fontSize: 16, fontWeight: 'bold' }}>
									Mục tiêu: {mucTieu.muctieu} giờ | Đã học: {thongKe.tongThoiGian} giờ
								</span>
								<Popconfirm
									title='Bạn có chắc muốn xóa mục tiêu này?'
									onConfirm={handleDeleteMucTieu}
									okText='Có'
									cancelText='Không'
								>
									<Button danger size='small' style={{ marginLeft: 12 }}>
										Xóa
									</Button>
								</Popconfirm>
							</>
						) : (
							<span style={{ color: '#999' }}>Chưa đặt mục tiêu</span>
						)}
					</div>
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAddMucTieu}>
						{mucTieu ? 'Cập nhật mục tiêu' : 'Thêm mục tiêu'}
					</Button>
				</div>
				<Progress
					percent={parseFloat(thongKe.tiLe.toFixed(1))}
					status={thongKe.tiLe >= 100 ? 'success' : 'active'}
					strokeColor={thongKe.tiLe >= 100 ? '#52c41a' : '#1890ff'}
				/>
			</Card>

			<Card
				title={
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span>Thống kê tiến độ học tập</span>
						<Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle='solid'>
							<Radio.Button value='day'>Theo ngày</Radio.Button>
							<Radio.Button value='month'>Theo tháng</Radio.Button>
						</Radio.Group>
					</div>
				}
				style={{ marginBottom: 24 }}
			>
				<Table
					dataSource={thongKeTheoKhoangThoiGian}
					rowKey='key'
					pagination={false}
					bordered
					scroll={{ x: 600 }}
					summary={(pageData) => {
						const tongSoGio = pageData.reduce((sum, item) => sum + item.tongGio, 0);
						return (
							<Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
								<Table.Summary.Cell index={0} colSpan={1} align='center'>
									Tổng cộng
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1} align='center'>
									{pageData.reduce((sum, item) => sum + item.soLuong, 0)} buổi học
								</Table.Summary.Cell>
								<Table.Summary.Cell index={2} align='center'>
									{tongSoGio.toFixed(1)} giờ
								</Table.Summary.Cell>
								<Table.Summary.Cell index={3} align='center'>
									-
								</Table.Summary.Cell>
								<Table.Summary.Cell index={4} align='center'>
									{mucTieu ? `${((tongSoGio / mucTieu.muctieu) * 100).toFixed(1)}%` : '0%'}
								</Table.Summary.Cell>
							</Table.Summary.Row>
						);
					}}
				>
					<Table.Column
						title={viewMode === 'day' ? 'Ngày học' : 'Tháng học'}
						dataIndex='key'
						key='key'
						align='center'
						width={100}
					/>
					<Table.Column title='Số buổi học' dataIndex='soLuong' key='soLuong' align='center' width={120} />
					<Table.Column
						title='Tổng giờ học'
						dataIndex='tongGio'
						key='tongGio'
						align='center'
						width={100}
						render={(value: number) => `${value.toFixed(1)} giờ`}
					/>
					<Table.Column
						title='Tổng cộng dồn'
						dataIndex='tongCongDon'
						key='tongCongDon'
						align='center'
						width={100}
						render={(value: number) => (
							<span style={{ fontWeight: 'bold', color: '#1890ff' }}>{value.toFixed(1)} giờ</span>
						)}
					/>
					<Table.Column
						title='Tiến độ so với mục tiêu'
						key='progress'
						align='center'
						width={100}
						render={(_: any, record: any) => {
							const percent = mucTieu ? (record.tongCongDon / mucTieu.muctieu) * 100 : 0;
							return (
								<Progress
									percent={parseFloat(percent.toFixed(1))}
									size='small'
									status={percent >= 100 ? 'success' : 'active'}
								/>
							);
						}}
					/>
					<Table.Column
						title='Chi tiết'
						key='action'
						align='center'
						width={200}
						render={(_: any, record: any) => (
							<Collapse ghost>
								<Collapse.Panel header='Xem chi tiết' key='1'>
									{record.chiTiet.map((item: tientrinhmonhoc, idx: number) => (
										<div
											key={item.id}
											style={{
												padding: '8px',
												borderBottom: idx < record.chiTiet.length - 1 ? '1px solid #f0f0f0' : 'none',
											}}
										>
											<div>
												<strong>{item.noiDungDaHoc}</strong> - {item.thoiLuongHoc}h
											</div>
											{item.ghiChu && <div style={{ fontSize: '12px', color: '#888' }}>{item.ghiChu}</div>}
										</div>
									))}
								</Collapse.Panel>
							</Collapse>
						)}
					/>
				</Table>
			</Card>

			<Card
				title='Danh sách tiến trình học tập'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
						Thêm tiến trình
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={filteredTienTrinh}
					rowKey='id'
					pagination={{
						pageSize: 10,
						showSizeChanger: true,
						showTotal: (total) => `Tổng số: ${total} bài học`,
					}}
					bordered
				/>
			</Card>

			<Modal
				title={editingRecord ? 'Sửa tiến trình học tập' : 'Thêm tiến trình học tập'}
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
						label='Ngày học'
						name='ngayhoc'
						rules={[{ required: true, message: 'Vui lòng chọn ngày học!' }]}
						initialValue={moment()}
					>
						<DatePicker
							style={{ width: '100%' }}
							format='DD/MM/YYYY'
							placeholder='Chọn ngày học'
							disabledDate={(current) => current && current > moment().endOf('day')}
						/>
					</Form.Item>
					<Form.Item
						label='Thời lượng học (giờ)'
						name='thoiLuongHoc'
						rules={[
							{ required: true, message: 'Vui lòng nhập thời lượng học!' },
							{ type: 'number', min: 0.1, message: 'Thời lượng phải lớn hơn 0!' },
						]}
					>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập số giờ học' min={0.1} step={0.5} />
					</Form.Item>
					<Form.Item
						label='Nội dung đã học'
						name='noiDungDaHoc'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung đã học!' }]}
					>
						<Input.TextArea rows={3} placeholder='Ví dụ: Chương 1, Bài 2, Kiến thức cơ bản...' />
					</Form.Item>
					<Form.Item label='Ghi chú' name='ghiChu'>
						<Input.TextArea rows={3} placeholder='Ghi chú thêm (không bắt buộc)' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editingMucTieu ? 'Cập nhật mục tiêu' : 'Thêm mục tiêu học tập'}
				visible={isMucTieuModalOpen}
				onOk={handleSubmitMucTieu}
				onCancel={() => {
					setIsMucTieuModalOpen(false);
					mucTieuForm.resetFields();
					setEditingMucTieu(null);
				}}
				okText={editingMucTieu ? 'Cập nhật' : 'Thêm'}
				cancelText='Hủy'
			>
				<Form form={mucTieuForm} layout='vertical'>
					<Form.Item
						label='Mục tiêu số giờ học'
						name='muctieu'
						rules={[
							{ required: true, message: 'Vui lòng nhập mục tiêu!' },
							{ type: 'number', min: 1, message: 'Mục tiêu phải lớn hơn 0!' },
						]}
					>
						<InputNumber style={{ width: '100%' }} placeholder='Số giờ muốn đạt được' min={1} step={5} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TienDoHocTap;
