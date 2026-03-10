// Utility để debug localStorage
export const debugLocalStorage = () => {
	console.group('🔍 DEBUG LOCALSTORAGE');
	
	const keys = ['monHoc_data', 'tientrinhmonhoc_data', 'muctieumonhoc_data'];
	
	keys.forEach(key => {
		const data = localStorage.getItem(key);
		if (data) {
			try {
				const parsed = JSON.parse(data);
				console.log(`✅ ${key}:`, parsed.length, 'items');
				console.table(parsed);
			} catch (e) {
				console.error(`❌ Error parsing ${key}:`, e);
			}
		} else {
			console.log(`⚠️ ${key}: Không có dữ liệu`);
		}
	});
	
	console.groupEnd();
};

// Thêm vào window để có thể gọi từ console
if (typeof window !== 'undefined') {
	(window as any).debugLocalStorage = debugLocalStorage;
}

export const clearAllData = () => {
	console.warn('🗑️ Xóa tất cả dữ liệu localStorage...');
	localStorage.removeItem('monHoc_data');
	localStorage.removeItem('tientrinhmonhoc_data');
	localStorage.removeItem('muctieumonhoc_data');
	console.log('✅ Đã xóa xong. Refresh trang để load lại.');
};

if (typeof window !== 'undefined') {
	(window as any).clearAllData = clearAllData;
}
