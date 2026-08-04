class DepartmentRoutingService:
    MAPPING = {
        "Infrastruktur": "Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)",
        "Keamanan/Bencana": "Badan Penanggulangan Bencana Daerah (BPBD)",
        "Layanan Publik": "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP)",
        "Lingkungan": "Dinas Lingkungan Hidup (DLH)",
        "Kesehatan": "Dinas Kesehatan (Dinkes)",
        "Pendidikan": "Dinas Pendidikan (Disdik)",
        "Ketertiban Umum": "Satuan Polisi Pamong Praja (Satpol PP)",
        "Lainnya": "Disposisi Manual"
    }

    def get_department(self, category: str) -> str:
        if not category:
            return "Disposisi Manual"
            
        # Match exact or case-insensitive keyword
        category_clean = category.strip()
        if category_clean in self.MAPPING:
            return self.MAPPING[category_clean]
            
        for key, dept in self.MAPPING.items():
            if key.lower() in category_clean.lower() or category_clean.lower() in key.lower():
                return dept
                
        return "Disposisi Manual"

department_routing_service = DepartmentRoutingService()
