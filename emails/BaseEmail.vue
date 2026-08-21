<template>
  <EHtml>
    <EHead>
      <EFont
        font-family="Inter"
        fallback-font-family="Helvetica"
        :web-font="{
          url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
          format: 'woff2'
        }"
      />
    </EHead>
    <EBody :style="mainStyle">
      <EContainer :style="containerStyle">
        <EImg 
          src="https://i.imgur.com/kPqAs8T.png" 
          width="120" 
          height="auto" 
          alt="CAP ALI Logo" 
          :style="logoStyle"
        />
        
        <div :style="contentStyle">
          <slot/>
        </div>

        <EHr :style="dividerStyle" />

        <EText :style="footerTextStyle">
          Vous recevez cet email car vous êtes inscrit(e) sur la plateforme <strong>CAP ALI</strong>.<br>
          Tracer le chemin de l'avenir.<br>
          <ELink href="https://capali.org" :style="linkStyle">capali.org</ELink>
        </EText>
      </EContainer>
    </EBody>
  </EHtml>
</template>

<script setup lang="ts">
import { Html as EHtml, Head as EHead, Font as EFont, Body as EBody, Container as EContainer, Img as EImg, Text as EText, Hr as EHr, Link as ELink } from '@vue-email/components'

const mainStyle = {
  backgroundColor: '#f1f5f9',
  fontFamily: 'Inter, Helvetica, Arial, sans-serif',
  padding: '40px 0',
}

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  maxWidth: '600px',
}

const logoStyle = {
  margin: '0 auto 32px auto',
  display: 'block',
}

const contentStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#334155',
}

const dividerStyle = {
  borderColor: '#e2e8f0',
  margin: '32px 0 24px 0',
}

const footerTextStyle = {
  fontSize: '13px',
  lineHeight: '1.5',
  color: '#64748b',
  textAlign: 'center' as const,
}

const linkStyle = {
  color: '#1B6B3A',
  textDecoration: 'none',
  fontWeight: '600',
}
</script>
