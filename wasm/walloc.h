#ifndef WALLOC_H
#define WALLOC_H

unsigned char mem[0x10000];
unsigned long long memPtr = 0;

void* malloc(unsigned long long size) {
    void* ptr = &mem[memPtr];
    memPtr += size;
    return ptr;
}

void assert(int i) {

}

void memcpy(void* dst, void* src, unsigned long long size) {
    unsigned char* pd = (unsigned char*) dst;
    unsigned char* ps = (unsigned char*) src;

    for(int i = 0; i < size; ++i)
        *pd = *ps;
}

void free(void* block) {

}

#endif