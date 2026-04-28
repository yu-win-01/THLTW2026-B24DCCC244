import React, { useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, DatePicker, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { HealthMetric } from '@/models/ungdungtheodoisuckhoe';

interface DuLieuBieuMauChiSoSucKhoe {
	ngay: dayjs.Dayjs;
	canNang: number;
	height: number;
	restingHR: number;
	sleepHours: number;
}

const NhatKyChiSoSucKhoe: React.FC = () => {
	const { danhSachChiSoSucKhoe, themChiSoSucKhoe, capNhatChiSoSucKhoe, xoaChiSoSucKhoe } =
		useModel('ungdungtheodoisuckhoe');
	const [moModal, setMoModal] = useState(false);
	const [chiSoDangSua, setChiSoDangSua] = useState<HealthMetric | null>(null);
	const [bieuMau] = Form.useForm();

	const moModalSua = (chiSo?: HealthMetric) => {
		setChiSoDangSua(chiSo || null);
		if (chiSo) {
			bieuMau.setFieldsValue({
				ngay: dayjs(chiSo.ngay),
				canNang: chiSo.canNang,
				height: chiSo.height,
				restingHR: chiSo.restingHR,
				sleepHours: chiSo.sleepHours,
			});
		} else {
			bieuMau.resetFields();
		}
		setMoModal(true);
	};

	const xuLyDongModal = () => {
		setMoModal(false);
		setChiSoDangSua(null);
		bieuMau.resetFields();
	};

	const xuLyGui = async () => {
		try {
			const giaTri = await bieuMau.validateFields();
			const duLieuBieuMau: DuLieuBieuMauChiSoSucKhoe = giaTri;

			const duLieuChiSo = {
				ngay: duLieuBieuMau.ngay.toISOString(),
				canNang: duLieuBieuMau.canNang,
				height: duLieuBieuMau.height,
				restingHR: duLieuBieuMau.restingHR,
				sleepHours: duLieuBieuMau.sleepHours,
			};

			if (chiSoDangSua) {
				capNhatChiSoSucKhoe(chiSoDangSua.id, duLieuChiSo);
			} else {
				themChiSoSucKhoe(duLieuChiSo);
			}

			xuLyDongModal();
		} catch (loi) {
			console.error('Xác thực thất bại:', loi);
		}
	};

	const xuLyXoa = (id: string) => {
		xoaChiSoSucKhoe(id);
	};

	const getBMITag = (bmi: number) => {
		if (bmi < 18.5) {
			return <Tag color='blue'>Thiếu cân</Tag>;
		} else if (bmi >= 18.5 && bmi < 25) {
			return <Tag color='green'>Bình thường</Tag>;
		} else if (bmi >= 25 && bmi < 30) {
			return <Tag color='yellow'>Thừa cân</Tag>;
		} else {
			return <Tag color='red'>Béo phì</Tag>;
		}
	};

	const cot: ColumnsType<HealthMetric> = [
		{
			title: 'Ngày',
			dataIndex: 'ngay',
			key: 'ngay',
			render: (ngay: string) => dayjs(ngay).format('DD/MM/YYYY'),
			sorter: (a, b) => dayjs(a.ngay).unix() - dayjs(b.ngay).unix(),
			align: 'center' as const,
		},
		{
			title: 'Cân nặng (kg)',
			dataIndex: 'canNang',
			key: 'canNang',
			sorter: (a, b) => a.canNang - b.canNang,
			align: 'center' as const,
		},
		{
			title: 'Chiều cao (cm)',
			dataIndex: 'height',
			key: 'height',
			sorter: (a, b) => a.height - b.height,
			align: 'center' as const,
		},
		{
			title: 'BMI',
			dataIndex: 'bmi',
			key: 'bmi',
			render: (bmi: number) => (
				<Space>
					{bmi}
					{getBMITag(bmi)}
				</Space>
			),
			sorter: (a, b) => a.bmi - b.bmi,
			align: 'center' as const,
		},
		{
			title: 'Nhịp tim lúc nghỉ (bpm)',
			dataIndex: 'restingHR',
			key: 'restingHR',
			sorter: (a, b) => a.restingHR - b.restingHR,
			align: 'center' as const,
		},
		{
			title: 'Giờ ngủ',
			dataIndex: 'sleepHours',
			key: 'sleepHours',
			sorter: (a, b) => a.sleepHours - b.sleepHours,
			align: 'center' as const,
		},
		{
			title: 'Thao tác',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => moModalSua(record)} />
					<Popconfirm
						title='Bạn có chắc muốn xóa chỉ số này?'
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
			<div style={{ marginBottom: 16 }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => moModalSua()}>
					Thêm chỉ số sức khỏe
				</Button>
			</div>

			<Table columns={cot} dataSource={danhSachChiSoSucKhoe} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={chiSoDangSua ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'}
				visible={moModal}
				onOk={xuLyGui}
				onCancel={xuLyDongModal}
				okText='Lưu'
				cancelText='Hủy'
			>
				<Form form={bieuMau} layout='vertical'>
					<Form.Item name='ngay' label='Ngày' rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name='canNang'
						label='Cân nặng (kg)'
						rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}
					>
						<InputNumber min={0} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name='height'
						label='Chiều cao (cm)'
						rules={[{ required: true, message: 'Vui lòng nhập chiều cao!' }]}
					>
						<InputNumber min={0} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name='restingHR'
						label='Nhịp tim lúc nghỉ (bpm)'
						rules={[{ required: true, message: 'Vui lòng nhập nhịp tim!' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='sleepHours' label='Giờ ngủ' rules={[{ required: true, message: 'Vui lòng nhập giờ ngủ!' }]}>
						<InputNumber min={0} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default NhatKyChiSoSucKhoe;
