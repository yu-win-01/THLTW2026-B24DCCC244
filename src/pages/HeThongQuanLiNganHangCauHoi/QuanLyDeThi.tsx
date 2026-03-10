import { useModel } from 'umi';
import { useState } from 'react';
import {
	Table,
	Popconfirm,
	message,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Tag,
	Col,
	Row,
	Card,
	Descriptions,
	Space,
} from 'antd';
import type { DeThi, CauHoi, MucDo } from '@/models/quanlydethi';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const mucDoLabels: Record<MucDo, string> = {
	de: 'Dễ',
	trungbinh: 'Trung bình',
	kho: 'Khó',
	ratkho: 'Rất khó',
};

const mucDoColors: Record<MucDo, string> = {
	de: 'green',
	trungbinh: 'blue',
	kho: 'orange',
	ratkho: 'red',
};

const QuanLyDeThi = () => {
	const { deThi, themDeThi, capNhatDeThi, xoaDeThi, monHoc, cauTrucDeThi, khoiKienThuc } = useModel('quanlydethi');

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<DeThi | null>(null);
	const [viewDeThi, setViewDeThi] = useState<DeThi | null>(null);
	const [form] = Form.useForm();
	const [searchText, setSearchText] = useState('');
	const [filterMonHoc, setFilterMonHoc] = useState<string>('');

	const filteredData = deThi.filter((item: DeThi) => {
		const matchText =
			item.tenDeThi.toLowerCase().includes(searchText.toLowerCase()) ||
			item.maDeThi.toLowerCase().includes(searchText.toLowerCase());
		const matchMonHoc = !filterMonHoc || item.monHocId === filterMonHoc;
		return matchText && matchMonHoc;
	});

	const handleAdd = () => {
		const values = form.getFieldsValue();
		const deThiMoi: DeThi = {
			id: Date.now().toString(),
			maDeThi: `DT${Date.now()}`,
			tenDeThi: values.tenDeThi,
			monHocId: values.monHocId,
			danhSachCauHoi: [],
			ngayTao: new Date().toISOString(),
		};
		themDeThi(deThiMoi);
		message.success('Thêm đề thi thành công');
		setIsOpen(false);
		form.resetFields();
	};

	const handleEdit = () => {
		if (!isEdit) return;
		const values = form.getFieldsValue();
		capNhatDeThi(isEdit.id, {
			tenDeThi: values.tenDeThi,
		});
		message.success('Cập nhật đề thi thành công');
		setIsEdit(null);
		setIsOpen(false);
		form.resetFields();
	};

	const onEdit = (record: DeThi) => {
		setIsEdit(record);
		form.setFieldsValue({
			tenDeThi: record.tenDeThi,
			monHocId: record.monHocId,
		});
		setIsOpen(true);
	};

	const handleDelete = (id: string) => {
		xoaDeThi(id);
		message.success('Xóa đề thi thành công');
	};

	const handleView = (record: DeThi) => {
		setViewDeThi(record);
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
			title: 'Mã đề thi',
			dataIndex: 'maDeThi',
			key: 'maDeThi',
			width: 130,
			align: 'center' as const,
		},
		{
			title: 'Tên đề thi',
			dataIndex: 'tenDeThi',
			key: 'tenDeThi',
			ellipsis: true,
		},
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			width: 180,
			render: (monHocId: string) => {
				const mon = monHoc.find((m: any) => m.id === monHocId);
				return mon ? mon.tenMonHoc : 'N/A';
			},
		},
		{
			title: 'Số câu hỏi',
			dataIndex: 'danhSachCauHoi',
			key: 'soCauHoi',
			width: 110,
			align: 'center' as const,
			render: (danhSach: CauHoi[]) => danhSach.length,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ngayTao',
			key: 'ngayTao',
			width: 140,
			render: (ngayTao: string) => new Date(ngayTao).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			width: 150,
			render: (_: any, record: DeThi) => (
				<Space>
					<EyeOutlined
						title='Xem'
						style={{ fontSize: 16, color: '#52c41a', cursor: 'pointer' }}
						onClick={() => handleView(record)}
					/>
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
				</Space>
			),
		},
	];

	return (
		<div>
			<h2>Quản Lý Đề Thi</h2>
			<Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
						Thêm đề thi thủ công
					</Button>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} sm={12} md={8}>
					<Input
						placeholder='Tìm kiếm theo tên hoặc mã đề thi...'
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
					/>
				</Col>
				<Col xs={24} sm={12} md={8}>
					<Select
						placeholder='Lọc theo môn học'
						style={{ width: '100%' }}
						value={filterMonHoc || undefined}
						onChange={(value) => setFilterMonHoc(value || '')}
						allowClear
					>
						{monHoc.map((mon: any) => (
							<Option key={mon.id} value={mon.id}>
								{mon.tenMonHoc}
							</Option>
						))}
					</Select>
				</Col>
			</Row>

			<Table
				dataSource={filteredData}
				columns={columns}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				scroll={{ x: 1000 }}
			/>

			<Modal
				title={isEdit ? 'Cập nhật đề thi' : 'Thêm đề thi'}
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
						label='Tên đề thi'
						name='tenDeThi'
						rules={[{ required: true, message: 'Vui lòng nhập tên đề thi!' }]}
					>
						<Input placeholder='Nhập tên đề thi' />
					</Form.Item>

					<Form.Item label='Môn học' name='monHocId' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
						<Select placeholder='Chọn môn học' disabled={!!isEdit}>
							{monHoc.map((mon: any) => (
								<Option key={mon.id} value={mon.id}>
									{mon.maMonHoc} - {mon.tenMonHoc}
								</Option>
							))}
						</Select>
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

			<Modal
				title='Chi tiết đề thi'
				visible={!!viewDeThi}
				onCancel={() => setViewDeThi(null)}
				footer={[
					<Button key='close' onClick={() => setViewDeThi(null)}>
						Đóng
					</Button>,
				]}
				width={900}
			>
				{viewDeThi && (
					<div>
						<Descriptions bordered column={2} style={{ marginBottom: 24 }}>
							<Descriptions.Item label='Mã đề thi'>{viewDeThi.maDeThi}</Descriptions.Item>
							<Descriptions.Item label='Tên đề thi'>{viewDeThi.tenDeThi}</Descriptions.Item>
							<Descriptions.Item label='Môn học'>
								{monHoc.find((m: any) => m.id === viewDeThi.monHocId)?.tenMonHoc || 'N/A'}
							</Descriptions.Item>
							<Descriptions.Item label='Ngày tạo'>
								{new Date(viewDeThi.ngayTao).toLocaleString('vi-VN')}
							</Descriptions.Item>
							<Descriptions.Item label='Cấu trúc đề thi' span={2}>
								{viewDeThi.cauTrucDeThiId
									? cauTrucDeThi.find((ct: any) => ct.id === viewDeThi.cauTrucDeThiId)?.tenCauTruc || 'N/A'
									: 'Không sử dụng cấu trúc'}
							</Descriptions.Item>
							<Descriptions.Item label='Tổng số câu hỏi' span={2}>
								{viewDeThi.danhSachCauHoi.length} câu
							</Descriptions.Item>
						</Descriptions>

						<h3>Danh sách câu hỏi</h3>
						{viewDeThi.danhSachCauHoi.length === 0 ? (
							<p style={{ textAlign: 'center', color: '#999' }}>Đề thi chưa có câu hỏi nào</p>
						) : (
							<div style={{ maxHeight: 400, overflowY: 'auto' }}>
								{viewDeThi.danhSachCauHoi.map((ch, index) => {
									const khoi = khoiKienThuc.find((k: any) => k.id === ch.khoiKienThucId);
									return (
										<Card key={ch.id} size='small' style={{ marginBottom: 12 }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
												<strong>Câu {index + 1}:</strong>
												<Space>
													<Tag>{khoi?.tenKhoi || 'N/A'}</Tag>
													<Tag color={mucDoColors[ch.mucDo]}>{mucDoLabels[ch.mucDo]}</Tag>
												</Space>
											</div>
											<p style={{ margin: 0 }}>{ch.noiDung}</p>
										</Card>
									);
								})}
							</div>
						)}
					</div>
				)}
			</Modal>
		</div>
	);
};

export default QuanLyDeThi;
