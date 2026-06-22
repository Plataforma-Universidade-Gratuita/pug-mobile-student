import React from "react";

import { useTranslation } from "react-i18next";

import { ProjectDetailScreen } from "@/features/project-detail";

export default function EnrollmentDetailRoute() {
	const { t } = useTranslation();

	return (
		<ProjectDetailScreen titleOverride={t("activity.enrollmentDetail.title")} />
	);
}
