@echo off
echo =====================================================
echo TAO BANG BANNERS CHO SLIDER TRANG CHU
echo =====================================================
echo.
echo File nay se tao bang banners va them 3 banners mau.
echo.
echo Vui long nhap mat khau MySQL root khi duoc hoi.
echo.
pause
echo.
mysql -u root -p doctor_appointment_db < database\create_banners_table.sql
echo.
echo =====================================================
echo HOAN TAT!
echo =====================================================
echo.
echo Hay restart backend de load Banner model.
echo.
pause
