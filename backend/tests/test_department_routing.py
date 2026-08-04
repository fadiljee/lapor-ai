from app.services.department_routing_service import department_routing_service

def test_department_mapping():
    assert "PUPR" in department_routing_service.get_department("Infrastruktur")
    assert "BPBD" in department_routing_service.get_department("Keamanan/Bencana")
    assert "DLH" in department_routing_service.get_department("Lingkungan")
    assert "Disposisi Manual" == department_routing_service.get_department("Lainnya")

if __name__ == "__main__":
    test_department_mapping()
    print("All Department Routing tests passed!")
