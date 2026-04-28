import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Select, Input, DatePicker, InputNumber, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { Workout } from '@/models/ungdungtheodoisuckhoe';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface DuLieuBieuMauBuoiTap {
	ngay: dayjs.Dayjs;
	loai: Workout['loai'];
	thoiLuong: number;
	caloDot: number;
	ghiChu: string;
	trangThai: Workout['trangThai'];
}

const NhatKyTapLuyen: React.FC = () => {
	const { danhSachBuoiTap, themBuoiTap, capNhatBuoiTap, xoaBuoiTap } = useModel('ungdungtheodoisuckhoe');
	const [moModal, setMoModal] = useState(false);
	const [buoiTapDangSua, setBuoiTapDangSua] = useState<Workout | null>(null);
	const [bieuMau] = Form.useForm();

	const [vanBanTimKiem, setVanBanTimKiem] = useState('');
	const [locLoai, setLocLoai] = useState<Workout['loai'] | 'all'>('all');
	const [khoangNgay, setKhoangNgay] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

	const danhSachBuoiTapDaLoc = useMemo(() => {
		return danhSachBuoiTap.filter((buoiTap) => {
			const khopTimKiem = buoiTap.ghiChu.toLowerCase().includes(vanBanTimKiem.toLowerCase());
			const khopLoai = locLoai === 'all' || buoiTap.loai === locLoai;
			const ngayBuoiTap = dayjs(buoiTap.ngay);
			const khopNgay =
				!khoangNgay[0] ||
				!khoangNgay[1] ||
				(ngayBuoiTap.isAfter(khoangNgay[0].startOf('day')) && ngayBuoiTap.isBefore(khoangNgay[1].endOf('day')));

			return khopTimKiem && khopLoai && khopNgay;
		});
	}, [danhSachBuoiTap, vanBanTimKiem, locLoai, khoangNgay]);

	const moModalSua = (buoiTap?: Workout) => {
		setBuoiTapDangSua(buoiTap || null);
		if (buoiTap) {
			bieuMau.setFieldsValue({
				ngay: dayjs(buoiTap.ngay),
				loai: buoiTap.loai,
				thoiLuong: buoiTap.thoiLuong,
				caloDot: buoiTap.caloDot,
				ghiChu: buoiTap.ghiChu,
				trangThai: buoiTap.trangThai,
			});
		} else {
			bieuMau.resetFields();
		}
		setMoModal(true);
	};

	const xuLyDongModal = () => {
		setMoModal(false);
		setBuoiTapDangSua(null);
		bieuMau.resetFields();
	};

	const xuLyGui = async () => {
		try {
			const giaTri = await bieuMau.validateFields();
			const duLieuBieuMau: DuLieuBieuMauBuoiTap = giaTri;

			const duLieuBuoiTap = {
				ngay: duLieuBieuMau.ngay.toISOString(),
				loai: duLieuBieuMau.loai,
				thoiLuong: duLieuBieuMau.thoiLuong,
				caloDot: duLieuBieuMau.caloDot,
				ghiChu: duLieuBieuMau.ghiChu,
				trangThai: duLieuBieuMau.trangThai,
			};

			if (buoiTapDangSua) {
				capNhatBuoiTap(buoiTapDangSua.id, duLieuBuoiTap);
			} else {
				themBuoiTap(duLieuBuoiTap);
			}

			xuLyDongModal();
		} catch (loi) {
			console.error('Xác thực thất bại:', loi);
		}
	};

	const xuLyXoa = (id: string) => {
		xoaBuoiTap(id);
	};

	const cot: ColumnsType<Workout> = [
		{
			title: 'Ngày',
			dataIndex: 'ngay',
			key: 'ngay',
			render: (ngay: string) => dayjs(ngay).format('DD/MM/YYYY'),
			sorter: (a, b) => dayjs(a.ngay).unix() - dayjs(b.ngay).unix(),
			align: 'center' as const,
		},
		{
			title: 'Loại bài tập',
			dataIndex: 'loai',
			key: 'loai',
			filters: [
				{ text: 'Cardio', value: 'Cardio' },
				{ text: 'Strength', value: 'Strength' },
				{ text: 'Yoga', value: 'Yoga' },
				{ text: 'HIIT', value: 'HIIT' },
				{ text: 'Other', value: 'Other' },
			],
			onFilter: (value, record) => record.loai === value,
			align: 'center' as const,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'thoiLuong',
			key: 'thoiLuong',
			sorter: (a, b) => a.thoiLuong - b.thoiLuong,
			align: 'center' as const,
		},
		{
			title: 'Calo đốt',
			dataIndex: 'caloDot',
			key: 'caloDot',
			sorter: (a, b) => a.caloDot - b.caloDot,
			align: 'center' as const,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			key: 'ghiChu',
			align: 'center' as const,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (trangThai: Workout['trangThai']) => (
				<Tag color={trangThai === 'Completed' ? 'green' : 'red'}>
					{trangThai === 'Completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
				</Tag>
			),
			filters: [
				{ text: 'Hoàn thành', value: 'Completed' },
				{ text: 'Bỏ lỡ', value: 'Missed' },
			],
			onFilter: (value, record) => record.trangThai === value,
			align: 'center' as const,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => moModalSua(record)} />
					<Popconfirm
						title='Bạn có chắc muốn xóa buổi tập này?'
						onConfirm={() => xuLyXoa(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
				<Input.Search
					placeholder='Tìm kiếm theo ghi chú...'
					onChange={(e) => setVanBanTimKiem(e.target.value)}
					style={{ width: 200 }}
				/>
				<Select
					placeholder='Lọc theo loại'
					style={{ width: 150 }}
					value={locLoai}
					onChange={(giaTri) => setLocLoai(giaTri)}
				>
					<Option value='all'>Tất cả</Option>
					<Option value='Cardio'>Cardio</Option>
					<Option value='Strength'>Strength</Option>
					<Option value='Yoga'>Yoga</Option>
					<Option value='HIIT'>HIIT</Option>
					<Option value='Other'>Other</Option>
				</Select>
				<RangePicker
					placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
					onChange={(ngay) => setKhoangNgay(ngay as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
				/>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => moModalSua()}>
					Thêm buổi tập
				</Button>
			</Space>

			<Table columns={cot} dataSource={danhSachBuoiTapDaLoc} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={buoiTapDangSua ? 'Sửa buổi tập' : 'Thêm buổi tập'}
				visible={moModal}
				onOk={xuLyGui}
				onCancel={xuLyDongModal}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form
					form={bieuMau}
					layout='vertical'
					initialValues={{
						trangThai: 'Completed' as Workout['trangThai'],
					}}
				>
					<Form.Item name='ngay' label='Ngày tập' rules={[{ required: true, message: 'Vui lòng chọn ngày tập!' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name='loai'
						label='Loại bài tập'
						rules={[{ required: true, message: 'Vui lòng chọn loại bài tập!' }]}
					>
						<Select placeholder='Chọn loại bài tập'>
							<Option value='Cardio'>Cardio</Option>
							<Option value='Strength'>Strength</Option>
							<Option value='Yoga'>Yoga</Option>
							<Option value='HIIT'>HIIT</Option>
							<Option value='Other'>Other</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name='thoiLuong'
						label='Thời lượng (phút)'
						rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='caloDot' label='Calo đốt' rules={[{ required: true, message: 'Vui lòng nhập calo đốt!' }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='ghiChu' label='Ghi chú'>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item
						name='trangThai'
						label='Trạng thái'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
					>
						<Select>
							<Option value='Completed'>Hoàn thành</Option>
							<Option value='Missed'>Bỏ lỡ</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default NhatKyTapLuyen;
