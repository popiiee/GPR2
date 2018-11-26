<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" indent="yes" omit-xml-declaration="yes"/>
	<xsl:template match="/">
		<html>
			<xsl:variable name="export"><xsl:value-of select="results/export"/></xsl:variable>
			<xsl:if test="$export = 'false'">
				<head>
					<title>Export Users and Passwords</title>
				</head>
				<body bgcolor="#CCCCCC">
					<center><b>Export Users and Passwords</b></center>
					<br/>
					Parameters : <xsl:value-of select="results/params"/><br/>
					<table cellpadding="5">
						<tr>
							<td></td>
							<td><b>Username</b></td>
							<td><b>Password</b></td>
						</tr>
						<xsl:for-each select="results/users/users_subitem">
							<tr>
								<td></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="username"/></td>
								<td nowrap="nowrap" valign="top"><xsl:value-of select="password"/></td>
							</tr>
						</xsl:for-each>
					</table>
				</body>
			</xsl:if>
			<xsl:if test="$export = 'true'">
				"Export Users and Passwords"<br/>
				"<xsl:value-of select="results/params"/>"<br/>
				,"Username"
				,"Password"
				<br/>
				<xsl:for-each select="results/users/users_subitem">
					,"<xsl:value-of select="username"/>"
					,"<xsl:value-of select="password"/>"
					<br/>
				</xsl:for-each>
			</xsl:if>
		</html>
	</xsl:template>
</xsl:transform>