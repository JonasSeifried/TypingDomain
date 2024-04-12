<script setup lang="ts">
type Props = {
    time: number
}
defineProps<Props>()
</script>

<template>
    <div class="flex justify-center fixed z-20 bottom-0 top-0 left-0 right-0 bg-[rgba(0,0,0,0.33)]">
        <p class="mt-52">
            <span class="text-8xl">{{ Math.trunc(time) }}</span>
            <span class="text-4xl">{{ (time - Math.trunc(time)).toFixed(2).substring(1) }}</span>
        </p>
    </div>
</template>
