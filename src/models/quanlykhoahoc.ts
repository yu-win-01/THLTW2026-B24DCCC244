import { useState, useEffect } from 'react';

interface khoaHocOnline {
  id: string;
  tenKhoaHoc: string;
  moTa: string;
  giangVienId: string;
  soluongHocVien: number;
  trangThai: 'dang-mo' | 'da-ket-thuc' | 'tam-dung';
}

const useQuanlykhoahoc = () => {
  const [khoaHocOnlineList, setKhoaHocOnlineListState] = useState<khoaHocOnline[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('khoaHocOnlineList');
    if (data) {
      setKhoaHocOnlineListState(JSON.parse(data));
    }
  }, []);

  const setKhoaHocOnlineList = (list: khoaHocOnline[]) => {
    setKhoaHocOnlineListState(list);
    localStorage.setItem('khoaHocOnlineList', JSON.stringify(list));
  };

  return { khoaHocOnlineList, setKhoaHocOnlineList };
};

export default useQuanlykhoahoc;