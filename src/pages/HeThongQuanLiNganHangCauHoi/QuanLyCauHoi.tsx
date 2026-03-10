import { useModel } from 'umi';
import { useState } from 'react';
import { Table, Popconfirm, message, Button, Modal, Form, Input, Select, Tag, Col, Row } from 'antd';
import type { CauHoi, MucDo } from '@/models/quanlydethi';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

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

const QuanLyCauHoi = () => {
	const { cauHoi, themCauHoi, capNhatCauHoi, xoaCauHoi, monHoc, khoiKienThuc } = useModel('quanlydethi');

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<CauHoi | null>(null);
	const [form] = Form.useForm<Omit<CauHoi, 'id'>>();
	const [searchText, setSearchText] = useState('');

	const [filterMonHoc, setFilterMonHoc] = useState<string>('');
	const [filterMucDo, setFilterMucDo] = useState<MucDo | ''>('');
	const [filterKhoi, setFilterKhoi] = useState<string>('');

	const filteredData = cauHoi.filter((item: CauHoi) => {
		const matchText =
			item.noiDung.toLowerCase().includes(searchText.toLowerCase()) ||
			item.maCauHoi.toLowerCase().includes(searchText.toLowerCase());
		const matchMonHoc = !filterMonHoc || item.monHocId === filterMonHoc;
		const matchMucDo = !filterMucDo || item.mucDo === filterMucDo;
		const matchKhoi = !filterKhoi || item.khoiKienThucId === filterKhoi;

		return matchText && matchMonHoc && matchMucDo && matchKhoi;
	});

	const handleAdd = () => {
		const values = form.getFieldsValue();
		const cauHoiMoi: CauHoi = {
			...values,
			id: Date.now().toString(),
			maCauHoi: `CH${Date.now()}`,
		};
		themCauHoi(cauHoiMoi);
		message.success('Thêm câu hỏi thành công');
		setIsOpen(false);
		form.resetFields();
	};

	const handleEdit = () => {
		if (!isEdit) return;
		const values = form.getFieldsValue();
		capNhatCauHoi(isEdit.id, values);
		message.success('Cập nhật câu hỏi thành công');
		setIsEdit(null);
		setIsOpen(false);
		form.resetFields();
	};

	const onEdit = (record: CauHoi) => {
		setIsEdit(record);
		form.setFieldsValue({
			monHocId: record.monHocId,
			noiDung: record.noiDung,
			mucDo: record.mucDo,
			khoiKienThucId: record.khoiKienThucId,
		});
		setIsOpen(true);
	};

	const handleDelete = (id: string) => {
		xoaCauHoi(id);
		message.success('Xóa câu hỏi thành công');
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
			title: 'Mã câu hỏi',
			dataIndex: 'maCauHoi',
			key: 'maCauHoi',
			width: 120,
			align: 'center' as const,
		},
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			width: 150,
			render: (monHocId: string) => {
				const mon = monHoc.find((m: any) => m.id === monHocId);
				return mon ? mon.tenMonHoc : 'N/A';
			},
		},
		{
			title: 'Nội dung câu hỏi',
			dataIndex: 'noiDung',
			key: 'noiDung',
			ellipsis: true,
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'khoiKienThucId',
			key: 'khoiKienThucId',
			width: 150,
			render: (khoiId: string) => {
				const khoi = khoiKienThuc.find((k: any) => k.id === khoiId);
				return khoi ? khoi.tenKhoi : 'N/A';
			},
		},
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			key: 'mucDo',
			width: 120,
			align: 'center' as const,
			render: (mucDo: MucDo) => <Tag color={mucDoColors[mucDo]}>{mucDoLabels[mucDo]}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			width: 120,
			render: (_: any, record: CauHoi) => (
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
			<h2>Quản Lý Câu Hỏi</h2>
			<Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
						Thêm câu hỏi
					</Button>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24} sm={12} md={6}>
					<Input
						placeholder='Tìm kiếm theo nội dung...'
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
					/>
				</Col>
				<Col xs={24} sm={12} md={6}>
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
				<Col xs={24} sm={12} md={6}>
					<Select
						placeholder='Lọc theo mức độ'
						style={{ width: '100%' }}
						value={filterMucDo || undefined}
						onChange={(value) => setFilterMucDo(value || '')}
						allowClear
					>
						<Option value='de'>Dễ</Option>
						<Option value='trungbinh'>Trung bình</Option>
						<Option value='kho'>Khó</Option>
						<Option value='ratkho'>Rất khó</Option>
					</Select>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Select
						placeholder='Lọc theo khối kiến thức'
						style={{ width: '100%' }}
						value={filterKhoi || undefined}
						onChange={(value) => setFilterKhoi(value || '')}
						allowClear
					>
						{khoiKienThuc.map((khoi: any) => (
							<Option key={khoi.id} value={khoi.id}>
								{khoi.tenKhoi}
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
				scroll={{ x: 1200 }}
			/>

			<Modal
				title={isEdit ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
				visible={isOpen}
				onCancel={() => {
					setIsOpen(false);
					setIsEdit(null);
					form.resetFields();
				}}
				footer={null}
				width={700}
			>
				<Form form={form} layout='vertical' onFinish={isEdit ? handleEdit : handleAdd}>
					<Form.Item label='Môn học' name='monHocId' rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
						<Select placeholder='Chọn môn học'>
							{monHoc.map((mon: any) => (
								<Option key={mon.id} value={mon.id}>
									{mon.maMonHoc} - {mon.tenMonHoc}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						label='Khối kiến thức'
						name='khoiKienThucId'
						rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}
					>
						<Select placeholder='Chọn khối kiến thức'>
							{khoiKienThuc.map((khoi: any) => (
								<Option key={khoi.id} value={khoi.id}>
									{khoi.tenKhoi}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label='Mức độ' name='mucDo' rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}>
						<Select placeholder='Chọn mức độ'>
							<Option value='de'>
								<Tag color='green'>Dễ</Tag>
							</Option>
							<Option value='trungbinh'>
								<Tag color='blue'>Trung bình</Tag>
							</Option>
							<Option value='kho'>
								<Tag color='orange'>Khó</Tag>
							</Option>
							<Option value='ratkho'>
								<Tag color='red'>Rất khó</Tag>
							</Option>
						</Select>
					</Form.Item>

					<Form.Item
						label='Nội dung câu hỏi'
						name='noiDung'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
					>
						<Input.TextArea rows={5} placeholder='Nhập nội dung câu hỏi tự luận...' />
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

export default QuanLyCauHoi;
