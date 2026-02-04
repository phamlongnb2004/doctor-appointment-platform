@echo off
echo =====================================================
echo LOAI BO TAT CA HARDCODE - HOAN CHINH
echo =====================================================
echo.
echo File nay se tao tat ca cac bang va du lieu mau:
echo - Features (Tai sao chon MEDLATEC)
echo - Specialties (Chuyen khoa)
echo - Statistics (Thong ke)
echo - Certifications (Chung nhan)
echo.
echo Vui long nhap mat khau MySQL root khi duoc hoi.
echo.
pause
echo.
mysql -u root -p doctor_appointment_db < database\remove_all_hardcode.sql
echo.
echo =====================================================
echo HOAN TAT!
echo =====================================================
echo.
echo Hay restart backend de load cac model moi.
echo.
pause
