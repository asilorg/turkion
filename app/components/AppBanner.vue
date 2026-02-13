<script setup lang="ts">
import { AUTHOR } from '~/constants/common'
</script>

<template>
  <UBanner
    id="nuxt-ui-v4"
    :title="$t('banner')"
    icon="i-streamline:islam-solid"
    close
    :actions="[{
      label: $t('contact'),
      color: 'neutral',
      variant: 'outline',
      trailingIcon: 'i-lucide-arrow-right',
      to: AUTHOR,
      target: '_blank',
      class: 'ring-0'
    }]"
  />
</template>
