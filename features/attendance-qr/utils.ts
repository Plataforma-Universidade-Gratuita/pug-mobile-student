/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
import QRCode from "qrcode-terminal/vendor/QRCode";
import QRErrorCorrectLevel from "qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel";

export function buildQrMatrix(value: string) {
	const qrCode = new QRCode(-1, QRErrorCorrectLevel.M);
	qrCode.addData(value);
	qrCode.make();

	return qrCode.modules;
}
