<script setup lang="ts">
const localePath = useLocalePath()

await navigateTo(localePath('/docs/common'), { replace: true })
</script>
