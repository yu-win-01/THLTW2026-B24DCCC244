import { useModel } from 'umi';
import { useState } from 'react';
import {
	Card,
	Button,
	Form,
	Input,
	Select,
	Table,
	Space,
	InputNumber,
	message,
	Modal,
	Popconfirm,
	Tag,
	Divider,
	Alert,
} from 'antd';
import type { CauTrucDeThi, YeuCauDeThi, MucDo } from '@/models/quanlydethi';
import { PlusOutlined, DeleteOutlined, SaveOutlined, FileAddOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const mucDoLabels: Record<MucDo, string> = {
	de: 'Dễ',
	trungbinh: 'Trung bình',
	kho: 'Khó',
	ratkho: 'Rất khó',
};

const TaoDeThiTheoCauTruc = () => {
	const {
		monHoc,
		khoiKienThuc,
		cauTrucDeThi,
		themCauTrucDeThi,
		xoaCauTrucDeThi,
		capNhatCauTrucDeThi,
		taoDeThiTheoCauTruc,
		themDeThi,
		cauHoi,
	} = useModel('quanlydethi');

	const [form] = Form.useForm();
	const [selectedMonHoc, setSelectedMonHoc] = useState<string>('');
	const [yeuCauList, setYeuCauList] = useState<YeuCauDeThi[]>([]);
	const [isEditMode, setIsEditMode] = useState<string | null>(null);

	const [yeuCauForm] = Form.useForm();

	const handleAddYeuCau = () => {
		yeuCauForm.validateFields().then((values) => {
			const yeuCau: YeuCauDeThi = {
				khoiKienThucId: values.khoiKienThucId,
				mucDo: values.mucDo,
				soLuong: values.soLuong,
			};
			setYeuCauList([...yeuCauList, yeuCau]);
			yeuCauForm.resetFields();
			message.success('Đã thêm yêu cầu');
		});
	};

	const handleRemoveYeuCau = (index: number) => {
		const newList = yeuCauList.filter((_, i) => i !== index);
		setYeuCauList(newList);
	};

	const handleReset = () => {
		form.resetFields();
		setSelectedMonHoc('');
		setYeuCauList([]);
		setIsEditMode(null);
	};

	const handleSaveCauTruc = () => {
		if (!selectedMonHoc) {
			message.error('Vui lòng chọn môn học!');
			return;
		}
		if (yeuCauList.length === 0) {
			message.error('Vui lòng thêm ít nhất một yêu cầu!');
			return;
		}

		form.validateFields().then((values) => {
			const cauTrucMoi: CauTrucDeThi = {
				id: isEditMode || Date.now().toString(),
				tenCauTruc: values.tenCauTruc,
				monHocId: selectedMonHoc,
				moTa: values.moTa,
				yeuCau: yeuCauList,
			};

			if (isEditMode) {
				capNhatCauTrucDeThi(isEditMode, cauTrucMoi);
				message.success('Cập nhật cấu trúc đề thi thành công!');
			} else {
				themCauTrucDeThi(cauTrucMoi);
				message.success('Lưu cấu trúc đề thi thành công!');
			}

			handleReset();
		});
	};

	const handleEditCauTruc = (cauTruc: CauTrucDeThi) => {
		setIsEditMode(cauTruc.id);
		form.setFieldsValue({
			tenCauTruc: cauTruc.tenCauTruc,
			moTa: cauTruc.moTa,
		});
		setSelectedMonHoc(cauTruc.monHocId);
		setYeuCauList(cauTruc.yeuCau);
	};

	const handleTaoDeThi = (cauTrucId: string) => {
		const result = taoDeThiTheoCauTruc(cauTrucId);
		if (result.success && result.deThi) {
			themDeThi(result.deThi);
			message.success('Tạo đề thi thành công!');
		} else {
			Modal.error({
				title: 'Không thể tạo đề thi',
				content: (
					<div>
						<p>Có lỗi xảy ra:</p>
						<ul>
							{result.errors?.map((err, index) => (
								<li key={`error-${index}-${err.substring(0, 10)}`}>{err}</li>
							))}
						</ul>
					</div>
				),
			});
		}
	};

	const yeuCauColumns = [
		{
			title: 'STT',
			dataIndex: 'index',
			key: 'index',
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'khoiKienThucId',
			key: 'khoiKienThucId',
			render: (khoiId: string) => {
				const khoi = khoiKienThuc.find((k: any) => k.id === khoiId);
				return khoi?.tenKhoi || 'N/A';
			},
		},
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			key: 'mucDo',
			render: (mucDo: MucDo) => <Tag color='blue'>{mucDoLabels[mucDo]}</Tag>,
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			key: 'soLuong',
			width: 100,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 80,
			render: (_: any, __: any, index: number) => (
				<DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleRemoveYeuCau(index)} />
			),
		},
	];

	const cauTrucColumns = [
		{
			title: 'STT',
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên cấu trúc',
			dataIndex: 'tenCauTruc',
			key: 'tenCauTruc',
		},
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			render: (monHocId: string) => {
				const mon = monHoc.find((m: any) => m.id === monHocId);
				return mon?.tenMonHoc || 'N/A';
			},
		},
		{
			title: 'Số yêu cầu',
			dataIndex: 'yeuCau',
			key: 'yeuCau',
			width: 100,
			render: (yeuCau: YeuCauDeThi[]) => yeuCau.length,
		},
		{
			title: 'Tổng số câu',
			dataIndex: 'yeuCau',
			key: 'tongCau',
			width: 120,
			render: (yeuCau: YeuCauDeThi[]) => yeuCau.reduce((sum, y) => sum + y.soLuong, 0),
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: 150,
			render: (_: any, record: CauTrucDeThi) => (
				<Space>
					<Button type='link' size='small' icon={<EditOutlined />} onClick={() => handleEditCauTruc(record)}>
						Sửa
					</Button>
					<Button type='link' size='small' icon={<FileAddOutlined />} onClick={() => handleTaoDeThi(record.id)}>
						Tạo đề
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa?'
						onConfirm={() => {
							xoaCauTrucDeThi(record.id);
							message.success('Xóa cấu trúc thành công');
						}}
						okText='Có'
						cancelText='Không'
					>
						<Button type='link' size='small' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const getSoLuongCauHoi = (monHocId: string, khoiId: string, mucDo: MucDo) => {
		return cauHoi.filter((c: any) => c.monHocId === monHocId && c.khoiKienThucId === khoiId && c.mucDo === mucDo)
			.length;
	};

	return (
		<div>
			<h2>Tạo Đề Thi Theo Cấu Trúc</h2>

			<Card title='Tạo/Chỉnh sửa cấu trúc đề thi' style={{ marginBottom: 24 }}>
				<Form form={form} layout='vertical'>
					<Form.Item
						label='Tên cấu trúc đề thi'
						name='tenCauTruc'
						rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc!' }]}
					>
						<Input placeholder='VD: Cấu trúc đề thi giữa kỳ' />
					</Form.Item>

					<Form.Item label='Môn học' required>
						<Select placeholder='Chọn môn học' value={selectedMonHoc || undefined} onChange={setSelectedMonHoc}>
							{monHoc.map((mon: any) => (
								<Option key={mon.id} value={mon.id}>
									{mon.maMonHoc} - {mon.tenMonHoc}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label='Mô tả' name='moTa'>
						<Input.TextArea rows={2} placeholder='Mô tả về cấu trúc đề thi...' />
					</Form.Item>
				</Form>

				<Divider>Thêm yêu cầu câu hỏi</Divider>

				{selectedMonHoc && (
					<Alert
						message='Thông tin'
						description='Bạn có thể thêm nhiều yêu cầu với các khối kiến thức và mức độ khác nhau.'
						type='info'
						showIcon
						style={{ marginBottom: 16 }}
					/>
				)}

				<Form form={yeuCauForm} layout='inline' style={{ marginBottom: 16 }}>
					<Form.Item name='khoiKienThucId' rules={[{ required: true, message: 'Chọn khối!' }]}>
						<Select placeholder='Khối kiến thức' style={{ width: 200 }}>
							{khoiKienThuc.map((khoi: any) => (
								<Option key={khoi.id} value={khoi.id}>
									{khoi.tenKhoi}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item name='mucDo' rules={[{ required: true, message: 'Chọn mức độ!' }]}>
						<Select placeholder='Mức độ' style={{ width: 150 }}>
							<Option value='de'>Dễ</Option>
							<Option value='trungbinh'>Trung bình</Option>
							<Option value='kho'>Khó</Option>
							<Option value='ratkho'>Rất khó</Option>
						</Select>
					</Form.Item>

					<Form.Item name='soLuong' rules={[{ required: true, message: 'Nhập số lượng!' }]}>
						<InputNumber min={1} placeholder='Số lượng' style={{ width: 120 }} />
					</Form.Item>

					<Form.Item>
						<Button type='dashed' icon={<PlusOutlined />} onClick={handleAddYeuCau}>
							Thêm yêu cầu
						</Button>
					</Form.Item>
				</Form>

				{yeuCauList.length > 0 && (
					<>
						<Table
							dataSource={yeuCauList}
							columns={yeuCauColumns}
							pagination={false}
							size='small'
							style={{ marginBottom: 16 }}
						/>

						{selectedMonHoc && (
							<Alert
								message='Số lượng câu hỏi có sẵn'
								description={
									<div>
										{yeuCauList.map((yc, index) => {
											const khoi = khoiKienThuc.find((k: any) => k.id === yc.khoiKienThucId);
											const available = getSoLuongCauHoi(selectedMonHoc, yc.khoiKienThucId, yc.mucDo);
											const isEnough = available >= yc.soLuong;
											return (
												<div
													key={`${yc.khoiKienThucId}-${yc.mucDo}-${index}`}
													style={{ color: isEnough ? 'green' : 'red' }}
												>
													{khoi?.tenKhoi} - {mucDoLabels[yc.mucDo]}: {available} câu có sẵn (cần {yc.soLuong})
												</div>
											);
										})}
									</div>
								}
								type={
									yeuCauList.every((yc) => getSoLuongCauHoi(selectedMonHoc, yc.khoiKienThucId, yc.mucDo) >= yc.soLuong)
										? 'success'
										: 'warning'
								}
								showIcon
								style={{ marginBottom: 16 }}
							/>
						)}
					</>
				)}

				<Space>
					<Button type='primary' icon={<SaveOutlined />} onClick={handleSaveCauTruc}>
						{isEditMode ? 'Cập nhật cấu trúc' : 'Lưu cấu trúc'}
					</Button>
					<Button onClick={handleReset}>Làm mới</Button>
				</Space>
			</Card>

			<Card title='Danh sách cấu trúc đề thi đã lưu'>
				<Table dataSource={cauTrucDeThi} columns={cauTrucColumns} rowKey='id' pagination={{ pageSize: 10 }} />
			</Card>
		</div>
	);
};

export default TaoDeThiTheoCauTruc;
