<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'true'">
				"Upload Forms Search"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				"Num"
				,"Username"
				,"Date"
				,"Form Info"
				<br/>
				<xsl:for-each select="results/metas/metas_subitem">
					"<xsl:value-of select="position()"/>"
					,"<xsl:value-of select="username"/>"
					,"<xsl:value-of select="date"/>"
					,"
						<xsl:for-each select="metaInfo/*">
							'<xsl:value-of select="name()"/>:<xsl:value-of select="."/>', 
						</xsl:for-each>
					"
					<br/>
				</xsl:for-each>
			</xsl:if>
			<xsl:if test="$export = 'false'">
				<head>
					<title>Welcome Forms Search</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Welcome Forms Search</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td><b>Form Results</b></td>
						</tr>
						<tr>
							<td></td>
							<td><b>Num</b></td>
							<td><b>Username</b></td>
							<td><b>Date</b></td>
							<td nowrap="nowrap"><b>Form Info</b></td>
						</tr>
						<xsl:for-each select="results/metas/metas_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="position()"/></td>
								<td valign="top"><xsl:value-of select="username"/></td>
								<td valign="top"><xsl:value-of select="date"/></td>
								<td nowrap="nowrap" valign="top"> 
									<table>
									<xsl:for-each select="metaInfo/*">
										<tr>
											<td><font size="-2"><b><xsl:value-of select="name()"/></b></font></td>
											<td><font size="-2"><xsl:value-of select="."/></font></td>
										</tr>
									</xsl:for-each>
										<tr>
											<td><b><font size="-1">Files Accessed:</font></b></td>
										</tr>
									<xsl:for-each select="transfers/transfers_subitem">
										<tr>
											<td></td>
											<td><font size="-2"><xsl:value-of select="direction"/>:<xsl:value-of select="path"/><xsl:value-of select="name"/></font></td>
										</tr>
									</xsl:for-each>
									</table>
								</td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>