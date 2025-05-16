#include <stdio.h>

int main()
{
    float av1, av2, mean;
    char next;

    do
    {
        scanf("%f %f", &av1, &av2);
        mean = (av1 + av2) / 2;
        printf("A média é ¨%f", mean);
        scanf("%c", &next);

    } while (next == 's');

    return 0;
}
