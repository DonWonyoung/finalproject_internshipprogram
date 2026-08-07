<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Pembayaran</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #f5f6fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }

        .card {
            background: #fff;
            width: 100%;
            max-width: 420px;
            border-radius: 16px;
            padding: 35px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            text-align: center;
        }

        .success-icon {
            width: 80px;
            height: 80px;
            background: #e9f9ef;
            color: #22c55e;
            border-radius: 50%;
            margin: 0 auto 20px;
            font-size: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        h1 {
            font-size: 32px;
            margin-bottom: 10px;
            color: #222;
        }

        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }

        .info-box {
            background: #f8f9fc;
            border-radius: 12px;
            padding: 20px;
            text-align: left;
            margin-bottom: 25px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 18px;
        }

        .info-row:last-child {
            margin-bottom: 0;
        }

        .success-message {
            background: #ecfdf3;
            color: #15803d;
            padding: 15px;
            border-radius: 12px;
            font-weight: bold;
        }

        .footer {
            margin-top: 25px;
            color: #777;
            font-size: 14px;
        }
    </style>
</head>
<body>

    <div class="card">
        <div class="success-icon">
            ✓
        </div>

        <h1>Pembayaran QRIS</h1>

        <p class="subtitle">
            Pembayaran berhasil disimulasikan.
        </p>

        <div class="info-box">
            <div class="info-row">
                <span>Order ID</span>
                <strong>{{ $order->id }}</strong>
            </div>

            <div class="info-row">
                <span>Total</span>
                <strong>Rp {{ number_format($order->total) }}</strong>
            </div>
        </div>

        <div class="success-message">
            Pembayaran berhasil disimulasikan 🎉
        </div>

        <p class="footer">
            Terima kasih telah melakukan transaksi.<br><br>
            *QR pembayaran disimulasikan untuk kebutuhan pengembangan sistem
        </p>
    </div>

</body>
</html>