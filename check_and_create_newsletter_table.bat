@echo off
echo ========================================
echo KIEM TRA VA TAO TABLE NEWSLETTER
echo ========================================
echo.
echo Buoc 1: Kiem tra table co ton tai khong...
echo.

mysql -h gondola.proxy.rlwy.net -P 43703 -u root -p railway -e "SHOW TABLES LIKE 'newsletter_subscriptions';"

echo.
echo ========================================
echo Neu thay "newsletter_subscriptions" o tren
echo thi table DA TON TAI - KHONG CAN TAO
echo.
echo Neu KHONG thay gi (Empty set)
echo thi table CHUA TON TAI - CAN TAO
echo ========================================
echo.
pause
echo.
echo Ban co muon TAO table khong? (Y/N)
set /p choice=Nhap lua chon: 

if /i "%choice%"=="Y" (
    echo.
    echo Dang tao table newsletter_subscriptions...
    mysql -h gondola.proxy.rlwy.net -P 43703 -u root -p railway < database/create_newsletter_subscriptions.sql
    echo.
    echo ========================================
    echo HOAN THANH! Kiem tra lai:
    echo ========================================
    mysql -h gondola.proxy.rlwy.net -P 43703 -u root -p railway -e "DESCRIBE newsletter_subscriptions;"
) else (
    echo.
    echo Da huy tao table.
)

echo.
echo ========================================
echo XONG! Nhan phim bat ky de thoat...
echo ========================================
pause
